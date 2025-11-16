import { Navigate } from 'react-router-dom';
import { keycloakService } from '../auth/keycloakService';

export const ProtectedRoute = ({ children }) => {
  if (!keycloakService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
