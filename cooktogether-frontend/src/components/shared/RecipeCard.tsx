// src/components/shared/RecipeCard.tsx
import { Link } from 'react-router-dom';
import { Star, ImageOff, Clock } from 'lucide-react';
import type { Recipe } from '@/services/recipe.service';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe & { description?: string };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    // 1. KEY CHANGE: Added `p-0` to the Card component.
    // This removes the Card's default `py-6` padding, making the image flush with the top border.
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-lg border p-0 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* The image container remains the same, it will now fill the top of the card perfectly */}
      <div className="aspect-video w-full overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-secondary text-muted-foreground">
            <ImageOff className="h-12 w-12" />
            <span className="mt-2 text-xs">No Image Available</span>
          </div>
        )}
      </div>

      <CardContent className="flex flex-grow flex-col p-4">
        <h3 className="text-lg font-semibold leading-snug">
          <Link
            to={`/recipe/${recipe.id}`}
            className="text-primary transition-colors hover:text-primary/80 focus:outline-none"
          >
            {recipe.title}
            {/* The stretched link for full-card clickability */}
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          by {recipe.author.username}
        </p>

        {recipe.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {recipe.description}
          </p>
        )}
      </CardContent>

      {/* 3. The footer also has its own padding and is pushed to the bottom. */}
      <CardFooter className="mt-auto flex items-center justify-between border-t p-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
          <span className="font-medium text-foreground">
            {recipe.average_rating.toFixed(1)}
          </span>
          <span className="text-xs">({recipe.total_ratings})</span>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-2">
          <Clock className="h-3.5 w-3.5" />
          <span>{totalTime} min</span>
        </Badge>
      </CardFooter>
    </Card>
  );
}