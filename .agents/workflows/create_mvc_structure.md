---
description: Create a standard MVC project structure
---

# Arquitectura del Proyecto (Patrón MVC)

## Backend (Java)
Ruta base: `/backend/src/main/java/com/app/`
Estructura de paquetes requerida:
- `/models`: Entidades de dominio y transferencia de datos (DTOs).
- `/views`: Plantillas de respuesta (o adaptadores JSON si es una API REST pura).
- `/controllers`: Controladores que reciben las peticiones HTTP.
- `/routes`: Configuración de enrutamiento y endpoints.
- `/services`: Lógica de negocio independiente del controlador.
- `/repositories`: Acceso y persistencia en la base de datos.
# Reglas de Desarrollo: Spring Boot

1. **Inyección de Dependencias:** NO uses `@Autowired` en las propiedades. Usa siempre inyección por constructor (preferiblemente usando `@RequiredArgsConstructor` de Lombok si está disponible).
2. **Arquitectura Limpia (MVC/API):** - Los `Controllers` solo deben manejar la capa web (rutas, validación de DTOs, códigos HTTP) y llamar a los `Services`.
   - Los `Services` contienen TODA la lógica de negocio.
   - Los `Repositories` (Spring Data JPA) solo se comunican con la base de datos.
3. **Manejo de Datos:** Nunca expongas Entidades de la base de datos directamente en el Controlador. Usa siempre DTOs (Data Transfer Objects) para las respuestas y peticiones (`RequestDTO`, `ResponseDTO`).
4. **Respuestas HTTP:** Retorna siempre objetos `ResponseEntity<T>` en los controladores para tener control absoluto sobre los códigos de estado HTTP (200, 201, 404, etc.).
5. **Manejo de Errores:** Usa un `@RestControllerAdvice` global para capturar excepciones y devolver respuestas de error estandarizadas en JSON.

## Frontend (TypeScript)
Ruta base: `/frontend/src/`
Estructura de carpetas requerida:
- `/models`: Interfaces, tipos de TypeScript y esquemas de datos.
- `/views`: Componentes de la interfaz de usuario (UI) y páginas renderizadas.
- `/controllers`: Hooks personalizados, gestores de estado y lógica de interacción.
- `/routes`: Definición de rutas y navegación del cliente.
- `/services`: Lógica para interactuar con la API del backend.
# Reglas de Desarrollo: React + TypeScript

1. **Componentes:** Escribe EXCLUSIVAMENTE componentes funcionales usando arrow functions (`const MiComponente = () => {}`). No uses componentes de clase.
2. **Tipado:** Usa `interface` para definir modelos de datos y las `Props` de los componentes. El tipado debe ser estricto (evita usar `any`).
3. **Gestión de Estado y Efectos:** Usa los Hooks nativos (`useState`, `useEffect`, `useContext`) para el estado local. Extrae la lógica compleja a Custom Hooks (`/controllers`).
4. **Consumo de API:** Ubica todas las llamadas al backend (axios o fetch) en la carpeta `/services`. Los componentes nunca deben hacer fetch directamente; deben llamar a las funciones del servicio.
5. **Estilizado:** (Añade aquí tu preferencia, ej: Usa Tailwind CSS para las clases / Usa CSS Modules para mantener los estilos aislados).