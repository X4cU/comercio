import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { keycloakService } from '../auth/keycloakService';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloakService.isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
    keycloakService.login();
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <span className="display-6 fw-bold text-primary">COMERCIO</span>
      </div>
      <p className="text-muted mb-4">
        Inicia sesión para acceder al panel de comercio.
      </p>
      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Iniciar sesión con Keycloak
      </button>
    </div>
  );
};

export default Login;
