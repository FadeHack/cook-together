// src/components/shared/RecipeDetailSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function RecipeDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Skeleton className="h-10 w-3/4 mb-4" />
      <Skeleton className="h-5 w-1/2 mb-8" />
      
      <div className="aspect-video w-full mb-8">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}