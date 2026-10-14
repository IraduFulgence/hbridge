import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './config';

import { useAuthStore } from '../stores/auth';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach access token to every request
apiClient.interceptors.request.use((config)=>{
  const token = useAuthStore.getState().accessToken;
if(token){
  config.headers.Authorization = `Bearer ${token}`;
}
return config;
});
// Log every request and response during development
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (__DEV__) {
      console.log('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  },
);