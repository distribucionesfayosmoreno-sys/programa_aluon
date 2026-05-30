# Integración Struts (legacy) → REST (Spring Boot)

Este repositorio expone el módulo como endpoints REST. El monolito Struts/Hibernate legacy debe consumirlos como “thin controller” (sin lógica de negocio).

## Endpoints

1) Crear job y obtener imagen base (Street View)

- `POST /api/door-visual-simulations`
- Body:
  - `address` (string, obligatorio)
  - `imageSize` (`"640x640"` | `"512x512"`, opcional)
  - `fov` (number, opcional)
  - `heading` (number|null, opcional)
  - `pitch` (number|null, opcional)
- Response:
  - `jobId` (uuid string)
  - `status` (`AWAITING_MASK`)
  - `baseImageUrl` (string, URL)
  - `imageWidth` (number)
  - `imageHeight` (number)

2) Iniciar inpainting (asíncrono)

- `POST /api/door-visual-simulations/{jobId}/inpaint`
- Body:
  - `maskRect: { x, y, width, height }` (píxeles sobre la imagen base)
  - `prompt` (string, opcional)
  - `negativePrompt` (string, opcional)
- Response:
  - `status` (`PROCESSING`)
  - `pollAfterMs` (number)

3) Polling de estado

- `GET /api/door-visual-simulations/{jobId}`
- Response:
  - `status`: `AWAITING_MASK` | `PROCESSING` | `DONE` | `FAILED`
  - `resultImageUrl` (string|null)
  - `errorMessage` (string|null)

## Multi-tenant

Este backend usa `@TenantId` (Hibernate 6). Si el legacy Struts conoce el tenant del usuario, se recomienda:

- Propagar `X-Tenant-Id: <uuid>` en todas las llamadas REST (si vuestra capa de entrada del backend lo soporta), **o**
- Reutilizar el mecanismo actual (cookie/sesión/token) que ya resuelve tenant en el backend.

Nota: en este repo aún no hay un filtro/Interceptor HTTP visible que lea `X-Tenant-Id`; si se necesita, se añade como parte de la integración de autenticación/tenant existente.

