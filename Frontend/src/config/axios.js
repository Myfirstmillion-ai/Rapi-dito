/**
 * Axios Instance Configuration
 * Pre-configured axios instance with proper CORS and authentication settings
 * 
 * NOTE: This instance is available for future use. Current implementation uses
 * individual axios calls with withCredentials: true for backward compatibility.
 * To use this instance, import it instead of axios:
 *   import axiosInstance from '../config/axios';
 *   const response = await axiosInstance.post('/user/login', data);
 */
import axios from 'axios';
import { API_BASE_URL } from './api';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: This enables sending cookies and auth headers in CORS requests
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors for debugging
    if (!error.response) {
      console.error('Network Error:', {
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        },
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
