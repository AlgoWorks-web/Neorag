// Add axios interceptor to handle CORS and authentication
import axios from 'axios';

// config.js - Updated configuration
const USE_LOCAL_API = false; // Set to false for production (server)

export const API_BASE_URL = USE_LOCAL_API
  ? 'http://localhost:8000/api'
  : 'https://hydersoft.com/api';

export const STORAGE_BASE_URL = USE_LOCAL_API
  ? 'http://localhost:8000/storage'
  : 'https://hydersoft.com/storage/app/public';



// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PDF utility functions
export const validatePdfResponse = (response) => {
  const contentType = response.headers['content-type'] || response.headers['Content-Type'];
  
  if (!contentType) {
    throw new Error('No content type header found');
  }
  
  if (!contentType.includes('application/pdf')) {
    throw new Error(`Expected PDF, got ${contentType}`);
  }
  
  return true;
};

export const createPdfBlob = (data) => {
  return new Blob([data], { type: 'application/pdf' });
};

export const downloadPdfBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const viewPdfBlob = (blob) => {
  const url = window.URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  
  if (!newWindow) {
    // Fallback if popup is blocked
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.click();
  }
  
  // Clean up after 5 seconds
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 5000);
};