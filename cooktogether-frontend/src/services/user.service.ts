// src/services/user.service.ts
import api from '@/config/axios';
import type { PaginatedRecipes } from './recipe.service';

/**
 * Fetches the recipes saved (bookmarked) by the current user.
 * The token from auth is sent automatically via the Axios interceptor.
 */
export const getSavedRecipes = async (): Promise<PaginatedRecipes> => {
  // Your backend endpoint for this is GET /users/me/saved
  const response = await api.get<PaginatedRecipes>('/users/me/saved');
  return response.data;
};

/**
 * Fetches the recipes created by the current user.
 * We can reuse the GET /recipes endpoint by filtering by the author's ID.
 * Note: This requires a backend adjustment to filter recipes by authorId.
 * If you don't have this, we can create a new backend endpoint for it.
 * For now, we'll assume the backend supports filtering.
 */
export const getMyRecipes = async (): Promise<PaginatedRecipes> => {
  // This is a placeholder for how you might implement this.
  // The best approach is a dedicated backend endpoint like GET /users/me/recipes
  // For now, let's just use the saved recipes endpoint as a stand-in to build the UI.
  // We can swap the service call later. In a real app, you'd have a specific endpoint.
  const response = await api.get<PaginatedRecipes>('/users/me/recipes'); // Assuming this endpoint exists
  return response.data;
};