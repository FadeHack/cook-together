// src/components/shared/MobileNav.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden" // Only visible on mobile
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      {/* KEY CHANGE: Added padding class 'p-6' for better spacing */}
      <SheetContent side="left" className="p-6">
        <Link
          to="/"
          className="flex items-center space-x-2 mb-8" // Added margin-bottom
          onClick={() => setIsOpen(false)}
        >
          <span className="font-bold text-lg">CookTogether</span>
        </Link>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleNavigate('/home')}
            className="text-left text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate('/my-recipes')}
            className="text-left text-muted-foreground transition-colors hover:text-foreground"
          >
            My Recipes
          </button>
          <button
            onClick={() => handleNavigate('/saved-recipes')}
            className="text-left text-muted-foreground transition-colors hover:text-foreground"
          >
            Saved Recipes
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}