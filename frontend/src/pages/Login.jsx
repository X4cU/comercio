import { keycloakService } from '../auth/keycloakService';

const Login = () => {
  const handleLogin = () => {
    keycloakService.login();
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <span className="display-6 fw-bold text-primary">COMERCIO</span>
      </div>
      <p className="text-muted mb-4">
        Autenticación con Keycloak pendiente (Fase 4)
      </p>
      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Iniciar sesión con Keycloak
      </button>
    </div>
  );
};

export default Login;
