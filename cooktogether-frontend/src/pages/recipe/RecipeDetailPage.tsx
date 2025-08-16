// src/pages/RecipeDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecipeStore } from '@/store/recipe.store';
import { useAuthStore } from '@/store/auth.store';
import { RecipeDetailSkeleton } from '@/components/shared/RecipeDetailSkeleton';
import {
  Bookmark,
  BookmarkCheck,
  ImageOff,
  User,
  Flame, // New icon
  Footprints, // New icon
} from 'lucide-react';
import { StarRating } from '@/components/shared/StarRating';
import { Button } from '@/components/ui/button';
import { rateRecipe, saveRecipe, unsaveRecipe } from '@/services/recipe.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

export default function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const { selectedRecipe, isLoading, error, fetchRecipeById, clearSelectedRecipe } = useRecipeStore();
  const { savedRecipeIds, addSavedRecipe, removeSavedRecipe } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const isSaved = recipeId ? savedRecipeIds.has(recipeId) : false;

  useEffect(() => {
    if (recipeId) {
      fetchRecipeById(recipeId);
    }
    return () => {
      clearSelectedRecipe();
    };
  }, [recipeId, fetchRecipeById, clearSelectedRecipe]);

  const handleRating = async (rating: number) => {
    if (!recipeId) return;
    try {
      await rateRecipe(recipeId, rating);
      fetchRecipeById(recipeId); // Re-fetch to show updated rating
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleToggleSave = async () => {
    if (!recipeId) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await unsaveRecipe(recipeId);
        removeSavedRecipe(recipeId);
      } else {
        await saveRecipe(recipeId);
        addSavedRecipe(recipeId);
      }
    } catch (err) {
      console.error("Failed to toggle save state:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <RecipeDetailSkeleton />;
  if (error) return <div className="text-center text-destructive py-10">{error}</div>;
  if (!selectedRecipe) return <div className="text-center py-10">Recipe not found.</div>;

  return (
    <div className="h-full overflow-y-auto bg-muted/20">
      <div className="container mx-auto max-w-6xl p-4 md:p-8">
        {/* --- HEADER SECTION --- */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{selectedRecipe.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-5 w-5" />
              <span className="font-medium">{selectedRecipe.author.username}</span>
            </div>
            <div className="flex items-center gap-4">
              <StarRating rating={selectedRecipe.average_rating} onRate={handleRating} />
              <Button variant="outline" size="sm" onClick={handleToggleSave} disabled={isSaving}>
                {isSaved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
              </Button>
            </div>
          </div>
        </header>

        {/* --- KEY CHANGE: TWO-COLUMN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* --- LEFT (MAIN) COLUMN --- */}
          <main className="lg:col-span-2">
            {/* Image */}
            <div className="aspect-video w-full bg-secondary rounded-lg mb-8 overflow-hidden shadow-lg">
              {selectedRecipe.imageUrl ? (
                <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                  <ImageOff className="h-16 w-16" />
                  <span className="text-sm mt-2">No Image Provided</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8">{selectedRecipe.description}</p>

            {/* Instructions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Footprints className="h-6 w-6 text-primary" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-6">
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {index + 1}
                      </div>
                      <p className="flex-grow pt-1 text-base">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </main>

          {/* --- RIGHT (SIDEBAR) COLUMN --- */}
          <aside className="lg:col-span-1 mt-8 lg:mt-0 lg:sticky lg:top-8 self-start">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Flame className="h-6 w-6 text-primary" />
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-around text-center mb-6 text-sm">
                    <div>
                        <p className="text-muted-foreground">Prep Time</p>
                        <p className="font-bold text-lg">{selectedRecipe.prep_time}m</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Cook Time</p>
                        <p className="font-bold text-lg">{selectedRecipe.cook_time}m</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-bold text-lg">{selectedRecipe.prep_time + selectedRecipe.cook_time}m</p>
                    </div>
                </div>
                <ul className="space-y-3">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3 text-base border-b pb-2 last:border-none last:pb-0">
                        <div className="h-2 w-2 rounded-full bg-primary/50 flex-shrink-0" />
                        <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}