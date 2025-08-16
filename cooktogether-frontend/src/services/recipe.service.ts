// src/services/recipe.service.ts
import api from '@/config/axios';

// --- TYPE DEFINITIONS ---

// The author object, as populated by the backend
export interface Author {
  id: string;
  username: string;
}

// The main Recipe object
export interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: number;
  cook_time: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  author: Author;
  average_rating: number;
  total_ratings: number;
  createdAt: string;
  updatedAt: string;
}

// The shape of the paginated response from the backend
export interface PaginatedRecipes {
  results: Recipe[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

// Optional parameters for fetching recipes
export interface GetRecipesParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

// --- API FUNCTIONS ---

/**
 * Fetches a paginated list of recipes.
 * @param params - Optional query parameters for search, pagination, etc.
 */
export const getRecipes = async (params: GetRecipesParams = {}): Promise<PaginatedRecipes> => {
  const response = await api.get<PaginatedRecipes>('/recipes', { params });
  console.log('Fetched recipes:', response.data);
  return response.data;
};

/**
 * Fetches a single recipe by its ID.
 * @param recipeId - The ID of the recipe.
 */
export const getRecipeById = async (recipeId: string): Promise<Recipe> => {
  const response = await api.get<Recipe>(`/recipes/${recipeId}`);
  console.log('Fetched recipe:', response.data);
  return response.data;
};

/**
 * Creates a new recipe.
 * The auth token is added automatically by the Axios interceptor.
 * @param recipeData - The data for the new recipe.
 */
export const createRecipe = async (recipeData: Omit<Recipe, 'id' | 'author' | 'createdAt' | 'updatedAt' | 'average_rating' | 'total_ratings'>): Promise<Recipe> => {
  const response = await api.post<Recipe>('/recipes', recipeData);
  return response.data;
};

/**
 * Submits a rating for a recipe.
 * @param recipeId - The ID of the recipe to rate.
 * @param rating - The rating value (1-5).
 */
export const rateRecipe = async (recipeId: string, rating: number): Promise<void> => {
  await api.post(`/recipes/${recipeId}/rate`, { rating });
};

/**
 * Saves a recipe to the user's bookmarks.
 * @param recipeId - The ID of the recipe to save.
 */
export const saveRecipe = async (recipeId: string): Promise<void> => {
  await api.post(`/recipes/${recipeId}/save`);
};

/**
 * Un-saves a recipe from the user's bookmarks.
 * @param recipeId - The ID of the recipe to unsave.
 */
export const unsaveRecipe = async (recipeId: string): Promise<void> => {
  await api.delete(`/recipes/${recipeId}/save`);
};