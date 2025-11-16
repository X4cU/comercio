import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:9000/api/v1'
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('kc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Placeholder for token refresh handling (Fase 4)
    return Promise.reject(error);
  }
);

export default axiosClient;
