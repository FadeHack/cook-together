// src/pages/SavedRecipesPage.tsx
import { useEffect, useState } from 'react';
import { getSavedRecipes } from '@/services/user.service';
import type { Recipe } from '@/services/recipe.service';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { RecipeCardSkeleton } from '@/components/shared/RecipeCardSkeleton';
import { Link } from 'react-router-dom';

export default function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getSavedRecipes();
        setSavedRecipes(response.results);
      } catch (err)
      {
        console.error('Failed to fetch saved recipes:', err);
        setError('Could not load your saved recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  return (
   
    <div className="h-full overflow-y-auto">
     
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Saved Recipes</h1>
          <p className="text-muted-foreground mt-2">Your personal collection of recipes to try.</p>
        </div>

        {error && <p className="text-center text-destructive">{error}</p>}

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? 
              Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            :
              savedRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>

        {/* The empty state message */}
        {!isLoading && savedRecipes.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
            <h2 className="text-xl font-semibold">Your Cookbook is Empty</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              Browse recipes and save the ones you love!
            </p>
            <Link to="/" className="text-primary hover:underline font-medium">
              Find Recipes to Save
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}