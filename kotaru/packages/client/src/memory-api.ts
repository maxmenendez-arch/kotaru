/**
 * Cliente de la API HTTP: centro de memoria, exportacion y retencion.
 *
 * Los tipos reflejan lo que devuelve apps/gateway/src/api.ts. `fetch` se inyecta para
 * poder probarlo en Node contra el servidor real.
 */
export type MemoryKind = 'fact' | 'preference' | 'plan' | 'relationship' | 'boundary';
export type MemoryStatus = 'proposed' | 'approved' | 'rejected';

export interface MemoryView {
  readonly id: string;
  readonly companionId: string;
  readonly kind: MemoryKind;
  readonly text: string;
  readonly status: MemoryStatus;
  readonly pinned: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly useCount: number;
  readonly lastUsedAt?: string;
  readonly expiresAt?: string;
}

export interface MemoryList {
  readonly memories: readonly MemoryView[];
  readonly approvedCount: number;
  readonly atCapacity: boolean;
}

/** Error de la API con el codigo que da el servidor (`at_capacity`, `payment_card`...). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(`${status} ${code}`);
    this.name = 'ApiError';
  }
}

export interface MemoryApiOptions {
  readonly baseUrl: string;
  /** Token de acceso vigente. Se pide en cada llamada: puede haberse renovado. */
  readonly getAccessToken: () => Promise<string>;
  readonly fetch?: typeof fetch;
}

export class MemoryApi {
  readonly #o: MemoryApiOptions;

  constructor(options: MemoryApiOptions) {
    this.#o = options;
  }

  list(companionId?: string): Promise<MemoryList> {
    return this.#call('GET', `/v1/memories${companionId ? `?companion=${encodeURIComponent(companionId)}` : ''}`);
  }

  async approve(id: string): Promise<MemoryView> {
    return (await this.#call<{ memory: MemoryView }>('POST', `/v1/memories/${id}/approve`)).memory;
  }

  async reject(id: string): Promise<MemoryView> {
    return (await this.#call<{ memory: MemoryView }>('POST', `/v1/memories/${id}/reject`)).memory;
  }

  async update(id: string, change: { readonly text?: string; readonly pinned?: boolean }): Promise<MemoryView> {
    return (await this.#call<{ memory: MemoryView }>('PATCH', `/v1/memories/${id}`, change)).memory;
  }

  async forget(id: string): Promise<void> {
    await this.#call('DELETE', `/v1/memories/${id}`);
  }

  exportAll(): Promise<unknown> {
    return this.#call('GET', '/v1/export');
  }

  async retentionDays(): Promise<number> {
    return (await this.#call<{ messageRetentionDays: number }>('GET', '/v1/settings/retention')).messageRetentionDays;
  }

  async setRetentionDays(days: number | null): Promise<number> {
    return (await this.#call<{ messageRetentionDays: number }>('PUT', '/v1/settings/retention', { days })).messageRetentionDays;
  }

  async #call<T>(method: string, path: string, body?: unknown): Promise<T> {
    const doFetch = this.#o.fetch ?? fetch;
    const response = await doFetch(`${this.#o.baseUrl.replace(/\/$/, '')}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${await this.#o.getAccessToken()}`,
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    const data = text ? (JSON.parse(text) as unknown) : null;
    if (!response.ok) throw new ApiError(response.status, (data as { error?: string } | null)?.error ?? 'unknown');
    return data as T;
  }
}
