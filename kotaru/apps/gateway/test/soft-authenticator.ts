import { createHash, generateKeyPairSync, randomBytes, sign, type KeyObject } from 'node:crypto';

/**
 * Autenticador de passkeys en software, para las pruebas: genera una clave P-256 y firma
 * lo mismo que firmaria un telefono (ES256, "none" como atestacion). Asi las pruebas pasan
 * por la verificacion criptografica real del servidor, no por un simulacro.
 */
type Cbor = number | string | Uint8Array | Map<number | string, Cbor>;

function head(major: number, n: number): Buffer {
  if (n < 24) return Buffer.from([(major << 5) | n]);
  if (n < 256) return Buffer.from([(major << 5) | 24, n]);
  if (n < 65536) return Buffer.from([(major << 5) | 25, n >> 8, n & 255]);
  const b = Buffer.alloc(5);
  b[0] = (major << 5) | 26;
  b.writeUInt32BE(n, 1);
  return b;
}

export function cbor(value: Cbor): Buffer {
  if (typeof value === 'number') return value >= 0 ? head(0, value) : head(1, -1 - value);
  if (typeof value === 'string') {
    const bytes = Buffer.from(value, 'utf8');
    return Buffer.concat([head(3, bytes.length), bytes]);
  }
  if (value instanceof Uint8Array) return Buffer.concat([head(2, value.length), Buffer.from(value)]);
  const parts: Buffer[] = [head(5, value.size)];
  for (const [k, v] of value) parts.push(cbor(k), cbor(v));
  return Buffer.concat(parts);
}

const b64u = (b: Uint8Array | string) => Buffer.from(b).toString('base64url');
const sha256 = (b: Uint8Array | string) => createHash('sha256').update(b).digest();

export class SoftAuthenticator {
  readonly credentialId = randomBytes(16);
  readonly #key: KeyObject;
  readonly #publicJwk: { x: string; y: string };
  userHandle: string | null = null;
  counter = 0;

  constructor() {
    const pair = generateKeyPairSync('ec', { namedCurve: 'P-256' });
    this.#key = pair.privateKey;
    const jwk = pair.publicKey.export({ format: 'jwk' }) as { x: string; y: string };
    this.#publicJwk = jwk;
  }

  get id(): string {
    return b64u(this.credentialId);
  }

  #authData(rpId: string, flags: number, attested?: Buffer): Buffer {
    const count = Buffer.alloc(4);
    count.writeUInt32BE(this.counter);
    return Buffer.concat([sha256(rpId), Buffer.from([flags]), count, ...(attested ? [attested] : [])]);
  }

  /** navigator.credentials.create() */
  register(
    options: { challenge: string; rp: { id?: string }; user: { id: string } },
    origin: string,
    tweak: { rpId?: string; flags?: number } = {},
  ) {
    const rpId = tweak.rpId ?? options.rp.id!;
    this.userHandle = options.user.id;
    const cose = cbor(
      new Map<number, Cbor>([
        [1, 2],
        [3, -7],
        [-1, 1],
        [-2, Buffer.from(this.#publicJwk.x, 'base64url')],
        [-3, Buffer.from(this.#publicJwk.y, 'base64url')],
      ]),
    );
    const idLen = Buffer.alloc(2);
    idLen.writeUInt16BE(this.credentialId.length);
    const attested = Buffer.concat([Buffer.alloc(16), idLen, this.credentialId, cose]);
    const authData = this.#authData(rpId, tweak.flags ?? 0x45, attested);
    const attestationObject = cbor(new Map<string, Cbor>([['fmt', 'none'], ['attStmt', new Map()], ['authData', authData]]));
    const clientData = JSON.stringify({ type: 'webauthn.create', challenge: options.challenge, origin, crossOrigin: false });
    return {
      id: this.id,
      rawId: this.id,
      type: 'public-key',
      response: {
        clientDataJSON: b64u(clientData),
        attestationObject: b64u(attestationObject),
        transports: ['internal'],
      },
      clientExtensionResults: {},
    };
  }

  /** navigator.credentials.get() */
  login(options: { challenge: string; rpId?: string }, origin: string, tweak: { counter?: number; key?: KeyObject } = {}) {
    if (tweak.counter !== undefined) this.counter = tweak.counter;
    else this.counter += 1;
    const authData = this.#authData(options.rpId!, 0x05);
    const clientData = JSON.stringify({ type: 'webauthn.get', challenge: options.challenge, origin, crossOrigin: false });
    const signature = sign('sha256', Buffer.concat([authData, sha256(clientData)]), tweak.key ?? this.#key);
    return {
      id: this.id,
      rawId: this.id,
      type: 'public-key',
      response: {
        clientDataJSON: b64u(clientData),
        authenticatorData: b64u(authData),
        signature: b64u(signature),
        ...(this.userHandle ? { userHandle: this.userHandle } : {}),
      },
      clientExtensionResults: {},
    };
  }
}
