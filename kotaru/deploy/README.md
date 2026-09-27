# Despliegue del gateway de Kotaru

Guía para `srv1987174` (Ubuntu, root). Todo lo que sigue se escribe **en el servidor**.

## Requisitos (ya hechos el 2026-09-26)

- Node 22 o superior (`node --version`).
- PostgreSQL con la base `kotaru` y su contraseña en `/root/kotaru.env`.
- El repositorio clonado en `~/Kotaru`.

## Instalar o actualizar

```bash
cd ~/Kotaru && git pull && cd kotaru && bash deploy/install.sh
```

El script compila, copia la versión a `/opt/kotaru/releases/<commit>`, aplica migraciones,
(re)arranca el servicio y corre una prueba de humo. Si la prueba falla, vuelve solo a la
versión anterior. Se puede correr las veces que haga falta.

La primera vez crea `/etc/kotaru/gateway.env` con claves de firma nuevas. Después nunca lo
toca: los cambios de configuración se hacen editando ese archivo y reiniciando.

## Qué queda en marcha

| Pieza | Dónde |
|---|---|
| Servicio | `kotaru-gateway` (systemd), usuario `kotaru` sin login, escucha en `127.0.0.1:8080` |
| Configuración y claves | `/etc/kotaru/gateway.env` (640, root:kotaru) |
| Versiones | `/opt/kotaru/releases/`, la activa en `/opt/kotaru/current` (se guardan 5) |
| Retención | `kotaru-retention.timer`, cada día a las 03:30 |
| Registros | `journalctl -u kotaru-gateway` — líneas JSON, sin contenido de conversación |

El gateway escucha solo dentro del servidor. Para que la app llegue desde internet hace
falta un proxy con TLS delante (ver "Siguiente paso").

## Operación diaria

```bash
systemctl status kotaru-gateway              # ¿está vivo?
journalctl -u kotaru-gateway -n 50           # últimos registros
journalctl -u kotaru-retention -n 5          # informes de retención
systemctl restart kotaru-gateway             # tras editar /etc/kotaru/gateway.env
curl -s http://127.0.0.1:8080/readyz         # {"ok":true} si la base responde
```

Prueba de humo a mano (sesión de voz, turno, centro de memoria, exportación):

```bash
set -a; . /etc/kotaru/gateway.env; set +a
node /opt/kotaru/current/bin/smoke.mjs http://127.0.0.1:8080
```

Token de prueba para la app mientras no exista el servicio de login:

```bash
set -a; . /etc/kotaru/gateway.env; set +a
node /opt/kotaru/current/bin/token.mjs
```

## Volver a una versión anterior

```bash
ls -1t /opt/kotaru/releases/
ln -sfn /opt/kotaru/releases/<commit> /opt/kotaru/current
systemctl restart kotaru-gateway
```

Las migraciones no se deshacen solas. Hasta hoy todas son aditivas o compatibles, así que
una versión anterior funciona con el esquema nuevo; si algún día no es así, lo dirá el
CHANGELOG.

## Rotar las claves de firma

En `/etc/kotaru/gateway.env`, añade la clave nueva **delante** de la vieja
(`KOTARU_GRANT_KEYS=g2:NUEVA,g1:VIEJA`), reinicia, espera 20 minutos (lo que dura el token
más largo) y quita la vieja. La primera firma; todas verifican.

```bash
openssl rand -base64 32   # genera una clave
```

## Activar los proveedores reales

El código de AssemblyAI (voz a texto), Gemini (conversación) y Polly (texto a voz) ya
está. Lo que falta no es código: son cuentas, claves y tres comprobaciones que solo puede
hacer el dueño de las cuentas. Sin ellas el gateway arranca, avisa en el registro
(`provider_blocked`) y el router no los usa. Así, un proveedor nunca recibe conversaciones
de usuarios sin haber cumplido las garantías del proyecto.

| Proveedor | Qué hacer | Variable que lo confirma |
|---|---|---|
| AssemblyAI | Cuenta de pago. Dashboard → Data Controls → desactivar el uso para entrenamiento (así la retención en streaming es cero) | `KOTARU_ASSEMBLYAI_ZERO_RETENTION_CONFIRMED=true` |
| Gemini | Clave de un proyecto de Google con facturación activa. En el nivel gratuito Google usa las conversaciones para mejorar sus productos | `KOTARU_GEMINI_PAID_TIER_CONFIRMED=true` |
| Polly | Usuario IAM con permiso `polly:SynthesizeSpeech` y política de exclusión de servicios de IA en AWS Organizations | `KOTARU_POLLY_AI_OPT_OUT_CONFIRMED=true` |
| Polly | Revisar los términos de AWS sobre uso comercial del audio generado | `KOTARU_POLLY_COMMERCIAL_TERMS_REVIEWED=true` |

Luego, en `/etc/kotaru/gateway.env`: pon `KOTARU_PROVIDERS=assemblyai,gemini,polly` y las
claves (ver `deploy/gateway.env.example`), y reinicia. La prueba de humo con proveedores
reales **gasta** (céntimos por ejecución).

Costo verificado el 2026-09-27: AssemblyAI 0,15 USD por hora de sesión abierta; Gemini 3.1
Flash-Lite 0,25 / 1,50 USD por millón de tokens de entrada / salida; Polly Neural 16 USD por
millón de caracteres. Cada turno registra su costo en `app.turn_metrics`.

## Activar el login (Apple y Google)

El servidor ya verifica los tokens de Apple y Google, crea la cuenta con un seudónimo nuevo,
emite tokens de acceso (15 min) y de renovación (60 días, rotan en cada uso), da grants de voz
(`POST /v1/session/grant`) y borra la cuenta desde la app (`DELETE /v1/account`, requisito de
las tiendas). El correo nunca se guarda en claro: HMAC para buscarlo y AES-256-GCM para poder
escribir.

Para encenderlo, en `/etc/kotaru/gateway.env`:
- `KOTARU_APPLE_CLIENT_IDS=app.kotaru.mobile` (el bundle id de iOS; añade el Services ID si
  hay login web).
- `KOTARU_GOOGLE_CLIENT_IDS=` los client ids de OAuth de Google (iOS, Android, web).
- Las dos claves del correo las generó `install.sh`. **No las cambies nunca**: con otra clave,
  los correos guardados quedan ilegibles.

Cada login exige un `nonce`: la app genera un valor aleatorio, se lo pasa a Apple (su SHA-256)
o a Google (tal cual), y lo manda junto al id token. Así un token interceptado no sirve para
abrir otra sesión. Las sesiones duran 60 días sin uso y 180 como máximo; reusar un token de
renovación ya gastado revoca la sesión entera (señal de copia robada).

Falta del lado de la app: las pantallas de login con los módulos nativos de Apple y Google
(`@kotaru/client` ya trae `AuthApi` con renovación automática).

## Siguiente paso: exponerlo a internet

Pendiente de decidir el subdominio (por ejemplo `api.kotaru.app`) y apuntar su DNS a la IP
del servidor. Con eso, Caddy da TLS automático en tres líneas:

```
api.kotaru.app {
    reverse_proxy 127.0.0.1:8080
}
```

Caddy reenvía WebSocket sin configuración extra. No abrir el puerto 8080 en el firewall: el
único acceso público debe ser el 443 de Caddy. Con Caddy delante, poner
`KOTARU_TRUST_PROXY=true` para que el límite de peticiones por IP vea la IP real.
