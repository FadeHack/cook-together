// src/store/auth.store.ts

import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';

// Define the shape of the User object based on your backend's response.
// We can expand this later as needed.
interface User {
  id: string;
  username: string;
  email: string;
  // Add any other user properties you expect from your /auth/me endpoint
}

// Define the interface for the store's state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // To handle the initial auth check on app load
  savedRecipeIds: Set<string>;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  setSavedRecipes: (recipeIds: string[]) => void;
  addSavedRecipe: (recipeId: string) => void;
  removeSavedRecipe: (recipeId: string) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  savedRecipeIds: new Set(), 

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  logout: async () => { 
    try {
      // Sign the user out of the Firebase session
      await signOut(auth); 
    } catch (error) {
      console.error("Error signing out from Firebase:", error);
    }
    // Clear the user state in our app
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      savedRecipeIds: new Set(),
    });
  },
// --- Saved Recipes ACTIONS ---
  setSavedRecipes: (recipeIds) => {
    set({ savedRecipeIds: new Set(recipeIds) });
  },
  addSavedRecipe: (recipeId) => {
    set((state) => ({
      savedRecipeIds: new Set(state.savedRecipeIds).add(recipeId),
    }));
  },
  removeSavedRecipe: (recipeId) => {
    set((state) => {
      const newSet = new Set(state.savedRecipeIds);
      newSet.delete(recipeId);
      return { savedRecipeIds: newSet };
    });
  },
}));