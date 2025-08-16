// src/services/auth.service.ts
import api from '@/config/axios';

// Type for our user object, matching the backend response
// We can move this to a types/ directory later if it gets bigger
interface User {
  id: string;
  username: string;
  email: string;
  // ... any other fields
}

/**
 * Fetches the current user's profile from our backend.
 * This is used to sync the Firebase user with our application's user data.
 * @param idToken The Firebase ID token.
 * @returns The user data from our database.
 */
export const getCurrentUser = async (idToken: string) => {
  const response = await api.get<{ user: User }>('/auth/me', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data.user;
};

/**
 * Registers a new user in our backend database after they've signed up with Firebase.
 * @param idToken The Firebase ID token.
 * @param username The username chosen by the user.
 * @returns The newly created user data.
 */
export const registerUser = async (idToken: string, username: string) => {
  const response = await api.post<{ user: User }>('/auth/register', {
    idToken,
    username,
  });
  return response.data.user;
};