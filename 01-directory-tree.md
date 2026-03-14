```text
PROGRAMA-ALUON/
├── backend/                  # Monolito Modular - Spring Boot 3
│   ├── src/main/java/com/aluon/
│   │   ├── core/             # Módulos Core (Tenant, User)
│   │   │   ├── tenant/       # Entidad y lógica de Tenant (Empresas)
│   │   │   └── user/         # Entidad y seguridad de Empleados
│   │   │
│   │   ├── crm/              # Módulo CRM
│   │   │   └── customer/     # Entidad Customer
│   │   │
│   │   ├── production/       # Módulo Producción
│   │   │   └── order/        # Entidad Order (Orden de Trabajo)
│   │   │
│   │   └── inventory/        # Módulo Inventario
│   │       └── material/     # Entidad Material (Stock)
│   │
│   └── pom.xml               # Dependencias de Spring Boot, Modulith y Postgres
│
├── frontend/                 # PWA React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Componentes reusables UI (Sidebar, Topbar)
│   │   ├── layouts/          # Dashboards (App.tsx)
│   │   ├── pages/            # Vistas
│   │   └── styles/           # Tailwind e index.css
│   ├── tailwind.config.js    # Colores corporativos
│   ├── package.json          # Dependencias (React, Tailwind, Vite)
│   └── vite.config.ts        # Configuración de PWA / Proxy
│
└── infra/                    # DevOps y Entornos
    ├── .env.local            # Variables locales
    ├── .env.dev              # Variables de desarrollo
    ├── .env.pre              # Variables de preproducción
    ├── .env.pro              # Variables de producción
    └── docker-compose.yml    # Contenedores para BD y servicios
```
