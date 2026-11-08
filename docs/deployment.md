# Despliegue automático por ramas

El workflow `.github/workflows/deploy.yml` valida cada `push` y despliega según la rama:

| Rama | Entorno GitHub | Etiqueta del runner | Archivo Compose | Archivo de entorno del servidor |
|---|---|---|---|---|
| `DEV2` | `dev2` | `aluon-dev2` | `infra/docker-compose.dev2.yml` | `/etc/aluon/dev2.env` |
| `PREPROD` | `preprod` | `aluon-preprod` | `infra/docker-compose.preprod.yml` | `/etc/aluon/preprod.env` |
| `PRODUCCION` | `production` | `aluon-prod` | `infra/docker-compose.yml` | `/etc/aluon/production.env` |

Cada servidor necesita Docker Engine, Docker Compose v2 y un runner de GitHub Actions instalado con su etiqueta correspondiente. El runner debe tener permiso para usar Docker.

Los archivos `.env` no se suben al repositorio. Se crean manualmente en cada servidor y contienen la configuración y los secretos de ese entorno. El entorno `production` debe configurarse en GitHub con revisión obligatoria si se quiere una aprobación antes de publicar, aunque el workflow queda preparado para desplegar automáticamente cada commit.

El despliegue usa `docker compose up -d --build --remove-orphans`; los volúmenes de PostgreSQL definidos por cada Compose se conservan.

## Direcciones y acceso público

| Entorno | VM | IP local | Frontend | Dominio de Cloudflare |
|---|---|---|---|---|
| Desarrollo | 201 | `192.168.99.20` | `5173` | `desarrolloprogramagestionaluon.iconseriespeliculas.xyz` |
| Preproducción / integración | 202 | `192.168.99.21` | `5174` | `preproduccionprogramagestionaluon.iconseriespeliculas.xyz` |
| Producción | 203 | `192.168.99.22` | `80` | `produccionprogramagestionaluon.iconseriespeliculas.xyz` |

Estas IP están fuera del rango DHCP `.50–.250`. Cada entorno conserva su propia base de datos y volumen. Los Compose usados por CI incluyen el dominio público de su entorno en CORS y conservan los orígenes adicionales definidos por el servidor.

La configuración activa de cada conector Cloudflare está en `/opt/aluon/cloudflare` de su VM. Los tokens del túnel y las credenciales de SMTP/Jira permanecen en los servidores o en archivos locales ignorados por Git. Las plantillas versionadas contienen los nombres de las variables, sin sus credenciales.

El flujo de promoción del código es `local` → `DEV2` → `PREPROD` → `PRODUCCION`. Node.js 22 y Java 21 son las versiones de validación usadas por el workflow.
