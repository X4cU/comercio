import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'Comercio',
  clientId: 'comercio-frontend',
});

let initialized = false;

export const keycloakService = {
  init() {
    if (initialized) return Promise.resolve(keycloak);

    return keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        initialized = true;
        if (authenticated) {
          localStorage.setItem('kc_token', keycloak.token);
          localStorage.setItem('kc_refresh_token', keycloak.refreshToken);
        } else {
          localStorage.removeItem('kc_token');
          localStorage.removeItem('kc_refresh_token');
        }

        keycloak.onTokenExpired = async () => {
          try {
            await keycloak.updateToken(30);
            localStorage.setItem('kc_token', keycloak.token);
            localStorage.setItem('kc_refresh_token', keycloak.refreshToken);
          } catch (err) {
            console.error('Error refreshing token', err);
            keycloakService.logout();
          }
        };

        return keycloak;
      });
  },

  login() {
    return keycloak.login();
  },

  logout() {
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_refresh_token');
    return keycloak.logout({ redirectUri: window.location.origin });
  },

  getToken() {
    return localStorage.getItem('kc_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('kc_token');
  },
};
