export const keycloakService = {
  login() {
    console.log('Keycloak login pending (Fase 4)');
  },
  logout() {
    console.log('Keycloak logout pending (Fase 4)');
    localStorage.removeItem('kc_token');
  },
  getToken() {
    return localStorage.getItem('kc_token');
  }
};
