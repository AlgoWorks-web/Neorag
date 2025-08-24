// // Add axios interceptor to handle CORS and authentication
// import axios from 'axios';

// // config.js - Updated configuration
// const USE_LOCAL_API = false; // Set to false for production (server)

// export const API_BASE_URL = USE_LOCAL_API
//   ? 'http://localhost:8000/api'
//   : 'https://hydersoft.com/api';

// export const STORAGE_BASE_URL = USE_LOCAL_API
//   ? 'http://localhost:8000/storage'
//   : 'https://hydersoft.com/storage/app/public';



// // Request interceptor
// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle authentication errors
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // PDF utility functions
// export const validatePdfResponse = (response) => {
//   const contentType = response.headers['content-type'] || response.headers['Content-Type'];
  
//   if (!contentType) {
//     throw new Error('No content type header found');
//   }
  
//   if (!contentType.includes('application/pdf')) {
//     throw new Error(`Expected PDF, got ${contentType}`);
//   }
  
//   return true;
// };

// export const createPdfBlob = (data) => {
//   return new Blob([data], { type: 'application/pdf' });
// };

// export const downloadPdfBlob = (blob, filename) => {
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', filename);
//   document.body.appendChild(link);
//   link.click();
//   link.remove();
//   window.URL.revokeObjectURL(url);
// };

// export const viewPdfBlob = (blob) => {
//   const url = window.URL.createObjectURL(blob);
//   const newWindow = window.open(url, '_blank');
  
//   if (!newWindow) {
//     // Fallback if popup is blocked
//     const link = document.createElement('a');
//     link.href = url;
//     link.target = '_blank';
//     link.click();
//   }
  
//   // Clean up after 5 seconds
//   setTimeout(() => {
//     window.URL.revokeObjectURL(url);
//   }, 5000);
// };

// config.js
import axios from 'axios';

// Toggle for local or production API
const USE_LOCAL_API = false;

export const API_BASE_URL = USE_LOCAL_API
  ? 'http://localhost:8000/api'
  : 'https://hydersoft.com/api';

export const STORAGE_BASE_URL = USE_LOCAL_API
  ? 'http://localhost:8000/storage'
  : 'https://hydersoft.com/storage/app/public';

// Create a separate axios instance to avoid global conflicts and enable testability
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Uncomment if your API needs cookies (for Sanctum, not JWT)
});

// Request interceptor for authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ensure "Bearer" is capitalized
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth/CORS/refresh scenarios
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // On auth error, clear token & redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('studentUser');
      localStorage.removeItem('trainerUser');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    // Optionally handle CORS or 403 status here, or display messages
    return Promise.reject(error);
  }
);

export default apiClient;

// PDF utility functions
export const validatePdfResponse = (response) => {
  const contentType = response.headers['content-type'] || response.headers['Content-Type'];
  if (!contentType) throw new Error('No content type header found');
  if (!contentType.includes('application/pdf')) {
    throw new Error(`Expected PDF, got ${contentType}`);
  }
  return true;
};

export const createPdfBlob = (data) => new Blob([data], { type: 'application/pdf' });

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
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 5000);
};
