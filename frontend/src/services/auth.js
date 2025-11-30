import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT
};

const keycloak = new Keycloak(keycloakConfig);

const initKeycloak = async () => {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256'
  });

  if (!authenticated) {
    await keycloak.login();
  }

  return keycloak;
};

const getToken = () => keycloak?.token;

const updateToken = async (minValidity = 30) => {
  try {
    const refreshed = await keycloak.updateToken(minValidity);
    return refreshed ? keycloak.token : keycloak.token;
  } catch (error) {
    console.error('No se pudo refrescar el token', error);
    await keycloak.login();
    return null;
  }
};

const logout = () => keycloak.logout();

const getProfile = async () => keycloak.loadUserProfile();

const getParsedToken = () => keycloak.tokenParsed || {};

export const authService = {
  keycloak,
  initKeycloak,
  getToken,
  updateToken,
  logout,
  getProfile,
  getParsedToken
};
