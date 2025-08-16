// src/store/recipe.store.ts
import { create } from 'zustand';
import * as recipeService from '@/services/recipe.service';
import type { Recipe, PaginatedRecipes, GetRecipesParams } from '@/services/recipe.service';

// --- STATE AND ACTIONS INTERFACES ---

interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  pagination: Omit<PaginatedRecipes, 'results'>;
  isLoading: boolean;
  error: string | null;
}

interface RecipeActions {
  fetchRecipes: (params?: GetRecipesParams) => Promise<void>;
  fetchRecipeById: (recipeId: string) => Promise<void>;
  clearSelectedRecipe: () => void;
}

// --- STORE INITIALIZATION ---

const initialState: RecipeState = {
  recipes: [],
  selectedRecipe: null,
  pagination: {
    page: 1,
    limit: 9,
    totalPages: 1,
    totalResults: 0,
  },
  isLoading: false,
  error: null,
};

export const useRecipeStore = create<RecipeState & RecipeActions>((set) => ({
  ...initialState,

  fetchRecipes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      console.log("params are ", params)
      const data = await recipeService.getRecipes(params);
      const { results, ...pagination } = data;
      set({
        recipes: results,
        pagination,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      set({ error: 'Failed to load recipes.', isLoading: false });
    }
  },

  fetchRecipeById: async (recipeId) => {
    set({ isLoading: true, error: null, selectedRecipe: null });
    try {
      const data = await recipeService.getRecipeById(recipeId);
      set({
        selectedRecipe: data,
        isLoading: false,
      });
    } catch (err) {
      console.error(`Failed to fetch recipe ${recipeId}:`, err);
      set({ error: 'Failed to load recipe details.', isLoading: false });
    }
  },

  clearSelectedRecipe: () => {
    set({ selectedRecipe: null });
  },
}));