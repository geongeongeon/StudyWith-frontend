import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      try {
        const response = await axios.post('/api/auth/token/refresh');
        const newAccessToken = response.headers.authorization.substring(7);
        authStore.save(newAccessToken);
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
      } catch (refreshError) {
        console.error('Error refreshing token: ', refreshError);
        authStore.clear();
        return Promise.reject(refreshError);
      }
    } 

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;