import React, { createContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    let isMounted = true;

    authService
      .initKeycloak()
      .then(async () => {
        if (!isMounted) return;
        const kcToken = authService.getToken();
        setToken(kcToken);
        const parsed = authService.getParsedToken();
        const userInfo = await authService.getProfile();
        setUser({
          name: userInfo?.firstName ? `${userInfo.firstName} ${userInfo.lastName || ''}` : userInfo?.username,
          email: userInfo?.email,
          role: (parsed.realm_access?.roles || [])[0] || 'usuario'
        });
        setRoles(parsed.realm_access?.roles || []);
        setLoading(false);

        authService.keycloak.onTokenExpired = async () => {
          const refreshed = await authService.updateToken(30);
          if (refreshed) {
            setToken(refreshed);
          }
        };
      })
      .catch((err) => {
        console.error('Error inicializando Keycloak', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = () => authService.logout();
  const login = () => authService.keycloak.login();

  const hasRole = (role) => roles.includes('superadmin') || roles.includes(role);

  const value = useMemo(
    () => ({ token, user, roles, loading, login, logout, hasRole }),
    [token, user, roles, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
