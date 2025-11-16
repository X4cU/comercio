import { Navigate } from 'react-router-dom';
import { keycloakService } from '../auth/keycloakService';

const ProtectedRoute = ({ children }) => {
  if (!keycloakService.getToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
