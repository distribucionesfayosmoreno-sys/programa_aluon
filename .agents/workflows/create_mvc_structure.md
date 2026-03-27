---
description: Create an MVC-aligned project structure for ALUON
---

# Arquitectura del Proyecto (Patron MVC)

Este workflow adapta el patron MVC al repositorio actual y a las reglas activas del proyecto.

## Backend (Java + Spring Boot)
Ruta base: `/backend/src/main/java/com/aluon/`

Estructura de paquetes requerida (por dominio, con MVC interno):
- `com.aluon.<dominio>.controller` -> Controladores HTTP
- `com.aluon.<dominio>.service` -> Logica de negocio
- `com.aluon.<dominio>.repository` -> Acceso a datos (Spring Data JPA)
- `com.aluon.<dominio>.model` -> Entidades JPA
- `com.aluon.<dominio>.dto` -> Request/Response DTOs
- `com.aluon.<dominio>.mapper` -> Mappers entre entidades y DTOs

Ejemplo:
- `com.aluon.crm.customer.controller.CustomerController`
- `com.aluon.crm.customer.service.CustomerService`
- `com.aluon.crm.customer.repository.CustomerRepository`
- `com.aluon.crm.customer.model.Customer`
- `com.aluon.crm.customer.dto.CustomerRequest`, `CustomerResponse`
- `com.aluon.crm.customer.mapper.CustomerMapper`

### Reglas de desarrollo (Backend)
1. **Inyeccion por constructor:** NO uses `@Autowired` en campos. Usa `@RequiredArgsConstructor` o constructor explicito.
2. **Separacion MVC estricta:**
   - Controllers: solo capa web, validacion, codigos HTTP, delegan al Service.
   - Services: toda la logica de negocio.
   - Repositories: solo persistencia.
3. **DTOs obligatorios:** Prohibido exponer `@Entity` en Controllers. Usa Request/Response DTOs.
4. **ResponseEntity recomendado:** Usa `ResponseEntity<T>` cuando necesites controlar status. En respuestas simples puedes devolver DTOs directamente.
5. **Errores globales:** Usa `@RestControllerAdvice` para respuestas de error estandarizadas.
6. **Limite de lineas:** Ningun archivo debe superar 500 lineas.

## Frontend (React + TypeScript)
Ruta base: `/frontend/src/`

Estructura MVC (por feature):
- `features/<feature>/views/` -> Componentes UI y paginas
- `features/<feature>/controllers/` -> Hooks y logica de interaccion
- `features/<feature>/models/` -> Tipos e interfaces
- `features/<feature>/services/` -> Acceso a API
- `features/<feature>/routes/` -> Rutas locales de la feature (si aplica)

Reglas adicionales para components grandes:
- `Componente.tsx` (solo composicion UI)
- `Componente.types.ts` (props y tipos)
- `useComponente.ts` (hook con estado/negocio)

### Reglas de desarrollo (Frontend)
1. **Componentes funcionales:** Solo funciones flecha.
2. **Tipado estricto:** Prohibido `any`. Usa `unknown` + type guards o genericos.
3. **Fetch fuera de .tsx:** Todas las llamadas API en `/services`.
4. **Separacion de logica:** UI en `views`, estado y reglas en `controllers`.
5. **Limite de lineas:** Ningun archivo debe superar 500 lineas.

## Pasos de trabajo (cuando se crea una nueva feature)
1. Crear carpeta feature en backend con subpaquetes `controller/service/repository/model/dto/mapper`.
2. Crear carpeta feature en frontend con `views/controllers/models/services`.
3. Implementar DTOs y mappers antes de exponer endpoints.
4. Validar que no haya `fetch` en `.tsx`.
5. Verificar limite de 500 lineas por archivo.
