// src/lib/api/apiClient.tsx
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor with logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.error(`API Error: ${error.response?.status || 'No Status'} ${error.config?.url}`, {
      response: error.response?.data,
      config: error.config
    });
    
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Attempting token refresh...');
          
          // Try to refresh token
          const response = await apiClient.post('/api/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem('token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      // You could redirect to unauthorized page or show a message
      window.location.href = '/unauthorized';
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - backend might be down');
      // Show user-friendly message
      error.response = {
        data: {
          message: 'Unable to connect to server. Please check your internet connection or try again later.'
        },
        status: 0,
        statusText: 'Network Error'
      };
    }
    
    return Promise.reject(error);
  }
);

// Make sure to export as default
export default apiClient;