// services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://gritfit-backend-rojk.onrender.com/api',
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
