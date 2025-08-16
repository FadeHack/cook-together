// src/routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout'; // <-- Import the new singular layout
import { PrivateRoutes } from './PrivateRoutes';

// Import all your pages
import LandingPage from '@/pages/landing/LandingPage';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import HomePage from '@/pages/home/HomePage';
import RecipeDetailPage from '@/pages/recipe/RecipeDetailPage';
import MyRecipesPage from '@/pages/recipe/MyRecipesPage';
import SavedRecipesPage from '@/pages/recipe/SavedRecipesPage';

import NotFoundPage from '@/pages/status/NotFoundPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* The AppLayout now wraps EVERY route */}
      <Route element={<AppLayout />}>
        {/* --- Publicly Accessible Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes --- */}
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
          <Route path="/my-recipes" element={<MyRecipesPage />} />
          <Route path="/saved-recipes" element={<SavedRecipesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};