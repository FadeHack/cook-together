// src/components/shared/AddRecipeDialog.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AddRecipeForm } from './AddRecipeForm';
import { PlusCircle } from 'lucide-react';
import { type Recipe } from '@/services/recipe.service';

export function AddRecipeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = (newRecipe: Recipe) => {
    setIsOpen(false);
    navigate(`/recipe/${newRecipe.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
        <span>
          {/* Desktop Button: Visible on 'sm' screens and up */}
          <Button className="hidden sm:flex items-center gap-2 text-xs">
            <PlusCircle className="h-4 w-4" />
            Add Recipe
          </Button>

          {/* Mobile Button: An icon-only button visible below 'sm' screens */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="flex sm:hidden">
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Post Recipe</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Post a new recipe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Share Your Recipe</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new recipe.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden py-4">
          <AddRecipeForm onSuccess={handleSuccess} />
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}