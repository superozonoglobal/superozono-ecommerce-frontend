import axios from 'axios';

export const API_BASE_URL = 'https://superozono-saas-api-349422942239.us-central1.run.app/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach the Bearer token automatically
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('superozono_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(`📡 [API SENDING] ${config.method?.toUpperCase()} ${config.url}`, config.data || '(No Payload)');
    return config;
  },
  (error) => {
    console.error(`🚨 [API SEND ERROR]`, error);
    return Promise.reject(error);
  }
);

// Response Interceptor to globally handle 401s (Token Expired) or format errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [API RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ [API FAILED] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('superozono_access_token');
        localStorage.removeItem('superozono_user');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);
