# COMERCIO Frontend

Base del frontend del sistema **COMERCIO** construido con React + Vite + Bootstrap y preparado para integrar Keycloak en la Fase 4.

## 🚀 Inicio rápido

```bash
cd frontend
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173` por defecto.

## 📁 Estructura del proyecto

```
frontend/
├── src/
│   ├── api/
│   │   └── axiosClient.js
│   ├── auth/
│   │   └── keycloakService.js
│   ├── components/
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── layouts/
│   │   ├── AppLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Perfil.jsx
│   ├── router/
│   │   └── AppRouter.jsx
│   ├── styles/
│   │   └── main.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 🔌 Integración con el backend

- `axiosClient` apunta a `http://localhost:9000/api/v1`.
- Incluye un interceptor para adjuntar el token almacenado en `localStorage` bajo la clave `kc_token`.
- Se dejó preparado el interceptor de respuesta para manejar el refresco del token en la Fase 4.

## 🔐 Flujo esperado con Keycloak (Fase 4)

1. `keycloakService.login()` redirigirá al usuario al IdP de Keycloak.
2. Keycloak devolverá el token y se almacenará en `localStorage` (`kc_token`).
3. `ProtectedRoute` verificará la existencia del token y permitirá o denegará el acceso a las rutas protegidas.
4. `keycloakService.logout()` invalidará la sesión en Keycloak y limpiará el token local.
5. Los interceptores de `axiosClient` usarán el token vigente y manejarán la renovación automática cuando expire.

Mientras tanto, todas las funciones de Keycloak muestran mensajes de consola indicando que su implementación real llegará en la Fase 4.
