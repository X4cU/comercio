import axios from 'axios';
import { keycloakService } from '../auth/keycloakService';

const axiosClient = axios.create({
  baseURL: 'http://localhost:9000/api/v1',
});

axiosClient.interceptors.request.use((config) => {
  const token = keycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
