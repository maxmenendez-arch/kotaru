# Pasos del propietario

Lo que solo puede hacer el dueño de las cuentas: registrarse, pagar, aceptar condiciones y
generar claves. Todo lo demás ya está hecho en el código. Actualizado el 2026-09-27.

**Regla para todas las claves:** van directamente al archivo de secretos del servidor
(`/etc/kotaru/gateway.env`), nunca al chat, al repositorio, a un correo ni a la app. Los
*client id* de Apple y Google no son secretos (van dentro de la app).

Orden recomendado: 1 → 2 → 3 → 4 → 5. Cada bloque se puede hacer por separado; el gateway
arranca igual con lo que falte y avisa en el registro.

---

## 1. Publicar el servidor en `api.kotaru.app` (10 minutos)

`kotaru.app` ya está registrado en Hostinger (sus DNS apuntan a Hostinger).

1. hPanel → **Dominios** → `kotaru.app` → **DNS / Nameservers** → añadir registro:
   tipo **A**, nombre **`api`**, apunta a **`2.25.230.90`**, TTL **300**.
2. Si el VPS tiene firewall en el panel de Hostinger: abrir **80/TCP**, **443/TCP** y
   **443/UDP**. No abrir el 8080.
3. En el servidor (`ssh root@2.25.230.90`):

   ```bash
   cd ~/Kotaru && git pull && cd kotaru
   bash deploy/install.sh                            # si aún no está instalado
   bash deploy/expose.sh api.kotaru.app TU_CORREO    # correo para avisos de Let's Encrypt
   ```

   Termina con `ok: https://api.kotaru.app responde`. Si dice que el DNS no resuelve, espera
   unos minutos y repítelo.

Aparte: `kotaru.ai` y `getkotaru.com` siguen **sin registrar** (comprobado el 2026-09-27).
La guía de marca recomendaba reservarlos junto a `kotaru.app`.

---

## 2. Proveedores de IA

Después de cada proveedor, en el servidor:

```bash
nano /etc/kotaru/gateway.env        # pegar la clave y poner la confirmación en true
systemctl restart kotaru-gateway
journalctl -u kotaru-gateway -n 30 --no-pager | grep -E 'provider_blocked|ready'
```

Cuando estén los tres: `KOTARU_PROVIDERS=assemblyai,gemini,polly` y reiniciar. La prueba de
humo (`deploy/README.md`, "Operación diaria") comprueba el servidor sin gastar; el primer
turno de voz real se prueba desde la app (paso 5), porque la prueba de humo envía silencio.

### AssemblyAI (voz a texto) — ~0,15 USD por hora de sesión

1. Crear cuenta: <https://www.assemblyai.com/dashboard/signup>.
2. **Añadir método de pago** (Billing). Sin cuenta de pago no se puede desactivar el
   entrenamiento.
3. Dashboard → **Data Controls** → desactivar el uso de datos para entrenar modelos. Con eso,
   la retención en streaming es cero.
4. Dashboard → **API Keys** → copiar la clave.
5. En `gateway.env`:
   ```
   ASSEMBLYAI_API_KEY=...
   KOTARU_ASSEMBLYAI_ZERO_RETENTION_CONFIRMED=true
   ```

### Gemini (conversación) — 0,25 / 1,50 USD por millón de tokens

1. <https://aistudio.google.com/projects> → crear proyecto (o usar uno nuevo solo para
   Kotaru).
2. **Set up billing** junto al proyecto → crear o elegir cuenta de facturación → Prepago
   (mínimo 5 USD) o pospago. **Imprescindible:** en el nivel gratuito Google usa las
   conversaciones para mejorar sus productos, con revisión humana.
3. **API keys** → crear clave en ese proyecto.
4. Recomendado: en Google Cloud → Facturación → **Presupuestos y alertas**, un presupuesto de
   20 USD con alertas al 50/75/90 %.
5. No usar el modo Flex.
6. En `gateway.env`:
   ```
   GEMINI_API_KEY=...
   KOTARU_GEMINI_PAID_TIER_CONFIRMED=true
   ```

### AWS Polly (texto a voz) — 16 USD por millón de caracteres

1. Crear cuenta de AWS: <https://portal.aws.amazon.com/billing/signup>.
2. **Excluir tus datos del entrenamiento de IA de AWS** (Polly está en la lista de servicios
   cubiertos):
   <https://console.aws.amazon.com/organizations/v2> → crear organización si no existe →
   **Policies → AI services opt-out policies** → *Enable* → **Opt out from all services** →
   confirmar.
3. Usuario solo para Kotaru: IAM → Users → *Create user* `kotaru-polly`, sin acceso a la
   consola, con esta política en línea (nada más):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{ "Effect": "Allow", "Action": "polly:SynthesizeSpeech", "Resource": "*" }]
   }
   ```
   → *Security credentials* → *Create access key* (tipo "Application running outside AWS").
4. Leer la sección de Amazon Polly en <https://aws.amazon.com/service-terms/> (uso comercial
   del audio generado).
5. Recomendado: **AWS Budgets** con un presupuesto mensual de 10 USD y alertas.
6. En `gateway.env`:
   ```
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   KOTARU_POLLY_AI_OPT_OUT_CONFIRMED=true
   KOTARU_POLLY_COMMERCIAL_TERMS_REVIEWED=true
   ```

El gateway además tiene su propio tope mensual (`KOTARU_MONTHLY_HARD_CAP_USD`, 50 USD):
al acercarse baja la calidad y al llegar corta la voz.

---

## 3. Apple: Sign in with Apple

1. Apple Developer Program (99 USD/año): <https://developer.apple.com/programs/enroll/>.
   Para publicar en la App Store hace falta de todos modos. Conviene hacerlo a nombre de la
   entidad de EE. UU. (D-001), no a título personal: cambiarlo después es lento.
2. <https://developer.apple.com/account/resources/identifiers/list> → **+** → *App IDs* →
   Bundle ID **`app.kotaru.mobile`** → marcar **Sign In with Apple**.
3. Servidor: `KOTARU_APPLE_CLIENT_IDS=app.kotaru.mobile` (ya viene así).

La app ya declara el permiso (`usesAppleSignIn`).

---

## 4. Google: client id de OAuth

En <https://console.cloud.google.com> (puede ser el mismo proyecto de Gemini):

1. **Google Auth Platform → Branding / Audience**: tipo *External*, nombre "Kotaru", correo
   de soporte. Sin permisos extra: solo el perfil básico del login.
2. **Clients → Create client**, tres veces:
   - **Web application**, nombre "Kotaru servidor". Sin URIs. → este es el **WEB_CLIENT_ID**.
   - **iOS**, bundle id `app.kotaru.mobile`. → **IOS_CLIENT_ID**.
   - **Android**, paquete `app.kotaru.mobile` y la huella **SHA-1** del certificado con que
     se firma la app. Hay una por cada firma: la de desarrollo (sale de
     `eas credentials`, o de `./gradlew signingReport` tras `npx expo prebuild`) y la de
     Google Play (Play Console → Integridad de la app). Crea un cliente Android por cada
     huella. Su id no se usa en ningún sitio, pero Google exige que exista.
3. Servidor: `KOTARU_GOOGLE_CLIENT_IDS=WEB_CLIENT_ID,IOS_CLIENT_ID`.
4. App (al compilar): `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=WEB_CLIENT_ID` y
   `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=IOS_CLIENT_ID`.

---

## 5. Probar la app en un teléfono

El audio real y los dos logins necesitan un build de desarrollo, no Expo Go.

- **iPhone:** hace falta un Mac con Xcode (`npx expo run:ios --device`) o una cuenta gratuita
  de Expo con EAS Build (`npx eas build --profile development --platform ios`), que compila
  en la nube. En los dos casos, cuenta de Apple Developer.
- **Android:** `npx expo run:android` con el teléfono conectado por USB, o EAS Build.

Variables al compilar:

```
EXPO_PUBLIC_KOTARU_SERVER_URL=https://api.kotaru.app
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
```

Qué comprobar en la primera prueba: entrar con Apple y con Google, hablar con Rio y oír la
respuesta, interrumpirla pulsando mientras habla, cerrar y reabrir la app (debe seguir con
la sesión abierta), y borrar la cuenta desde Ajustes.
