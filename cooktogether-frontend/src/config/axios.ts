// src/config/axios.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase'; // Get the initialized Firebase auth instance
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches the Firebase auth token to every outgoing request.
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Let Firebase SDK handle token caching and refreshing.
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting Firebase ID token:', error);
        // Optional: You could logout the user here if token retrieval fails
        // useAuthStore.getState().logout();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles global API errors, specifically for authentication.
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log('Authentication error (401). Logging out user.');
      
      // Call the logout action from the Zustand store.
      // This is the single, centralized place to handle the logout logic.
      useAuthStore.getState().logout();
    }

    // Return the error so that individual .catch() blocks can still handle it
    return Promise.reject(error);
  }
);

export default api;