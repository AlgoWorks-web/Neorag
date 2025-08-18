// Create a new file: utils/apiHelper.js
import { getValidAuthToken } from '../auth/authUtils';

export const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    // Get a valid token (refreshes if expired)
    const token = await getValidAuthToken();
    
    if (!token) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // If still 401 after refresh, authentication failed
    if (response.status === 401) {
      throw new Error('AUTHENTICATION_FAILED');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
