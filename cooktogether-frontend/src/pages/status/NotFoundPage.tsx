// src/pages/status/NotFoundPage.tsx
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuthStore();
  
  // Send users to the correct "home" based on their auth state
  const homePath = isAuthenticated ? '/home' : '/';

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link to={homePath}>Go Back Home</Link>
      </Button>
    </div>
  );
}