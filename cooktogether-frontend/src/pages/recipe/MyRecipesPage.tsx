// src/pages/MyRecipesPage.tsx
import { useEffect, useState } from 'react';
import { getMyRecipes } from '@/services/user.service';
import type { Recipe } from '@/services/recipe.service';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { RecipeCardSkeleton } from '@/components/shared/RecipeCardSkeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function MyRecipesPage() {
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getMyRecipes();
        console.log(response.results);
        setMyRecipes(response.results);
      } catch (err) {
        console.error('Failed to fetch my recipes:', err);
        setError('Could not load your recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  return (
    
    <div className="h-full overflow-y-auto">
      
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
        
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Recipes</h1>
          <p className="text-muted-foreground mt-2">The delicious creations you've shared with the community.</p>
        </div>

        {error && <p className="text-center text-destructive">{error}</p>}

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? 
              Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : 
              myRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>

        {/* The empty state message */}
        {!isLoading && myRecipes.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
            <h2 className="text-xl font-semibold">You Haven't Posted Any Recipes Yet</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              Share your favorite recipe and inspire others!
            </p>
            <Button asChild>
              <Link to="/add-recipe">Post Your First Recipe</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}