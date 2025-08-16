// src/routes/PrivateRoutes.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; 

export const PrivateRoutes = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner message="Authenticating, please wait..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};