// src/components/shared/Header.tsx

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { useAuthStore } from '@/store/auth.store';
import { UserNav } from '../shared/UserNav';
import { AddRecipeDialog } from '../shared/AddRecipeDialog';
import { MobileNav } from './MobileNav';
import { ChefHat } from "lucide-react"


export function Header() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-8">
        {/* --- LEFT GROUP (Mobile Nav & Brand) --- */}
        <div className="flex items-center">
          {/* Show mobile nav only when authenticated */}
          {isAuthenticated && <MobileNav />}
          <Link
            to={isAuthenticated ? '/home' : '/'}
            className="ml-2 md:ml-0 flex items-center"
          >
            <span className="font-bold">CookTogether</span>
            <ChefHat className="ml-2 h-6 w-6 text-primary" />
          </Link>
        </div>

        {/* --- CENTER GROUP (Desktop-only, Auth-only Nav Links) --- */}
        {isAuthenticated && (
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/home" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link to="/my-recipes" className="transition-colors hover:text-foreground/80">
                My Recipes
              </Link>
              <Link to="/saved-recipes" className="transition-colors hover:text-foreground/80">
                Saved Recipes
              </Link>
            </nav>
          </div>
        )}

        {/* --- RIGHT GROUP (Actions) --- */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-4 ml-auto">
          {isAuthenticated ? (
            // --- Authenticated User Actions ---
            <>
              <AddRecipeDialog />
              <UserNav />
            </>
          ) : (
            // --- Public User Actions ---
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </nav>
          )}
          <AnimatedThemeToggler />
        </div>
      </div>
    </header>
  );
}