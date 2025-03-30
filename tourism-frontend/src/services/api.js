import axios from 'axios';
import store from '@/store';
import router from '@/router';

// Create axios instance with base config
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle session expiration
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // If token is expired, redirect to login
      if (store.state.auth.token) {
        store.dispatch('auth/logout');
        store.dispatch('setNotification', {
          message: 'Your session has expired. Please login again.',
          type: 'error'
        });
        router.push('/login');
      }
    }
    
    // Handle server errors
    if (error.response && error.response.status === 500) {
      store.dispatch('setNotification', {
        message: 'Server error. Please try again later.',
        type: 'error'
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;