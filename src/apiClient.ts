import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL
});

// Add token to all requests
apiClient.interceptors.request.use(async (config) => {
  try {
    // Try to get fresh token from Cognito first
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Update localStorage with fresh token
      localStorage.setItem('authToken', token);
    } else {
      // Fallback to localStorage token
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        config.headers.Authorization = storedToken.startsWith('Bearer ')
          ? storedToken
          : `Bearer ${storedToken}`;
      }
    }
  } catch (error) {
    console.warn('Failed to get fresh token, using stored token:', error);
    // Fallback to localStorage token
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      config.headers.Authorization = storedToken.startsWith('Bearer ')
        ? storedToken
        : `Bearer ${storedToken}`;
    }
  }

  return config;
});

// Handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');

      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;