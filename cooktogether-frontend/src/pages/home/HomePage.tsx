// src/pages/HomePage.tsx

import { useState, useEffect, useCallback } from 'react';
import { useRecipeStore } from '@/store/recipe.store';
import { RecipeCard } from '@/components/shared/RecipeCard';
import { RecipeCardSkeleton } from '@/components/shared/RecipeCardSkeleton';
import { RecipeFilterPanel, type RecipeFilters } from '@/components/shared/RecipeFilterPanel';
import { useDebounce } from '@/hooks/useDebounce';
import { AppPagination } from '@/components/shared/AppPagination';
import { MobileFilterDrawer } from '@/components/shared/MobileFilterDrawer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlurFade } from '@/components/magicui/blur-fade';

// initial state for our filters
const initialFilters: RecipeFilters = {
  search: '',
  minRating: 0,
  maxCookTime: 180,
  maxPrepTime: 120,
};

type SortByType = 'latest' | 'trending';

export default function HomePage() {
  const { recipes, isLoading, fetchRecipes, error, pagination } = useRecipeStore();
  const [filters, setFilters] = useState<RecipeFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortByType>('latest');

  const debouncedFilters = useDebounce(filters, 500);


  useEffect(() => {
    const fetchFilteredRecipes = () => {
      const activeFilters: Record<string, any> = {
        page: currentPage,
        sortBy: sortBy,
        limit: 9,
      };
      
      if (debouncedFilters.search) activeFilters.search = debouncedFilters.search;
      if (debouncedFilters.minRating > 0) activeFilters.minRating = debouncedFilters.minRating;
      if (debouncedFilters.maxCookTime < 180) activeFilters.maxCookTime = debouncedFilters.maxCookTime;
      if (debouncedFilters.maxPrepTime < 120) activeFilters.maxPrepTime = debouncedFilters.maxPrepTime;
      
      fetchRecipes(activeFilters);
    };

    fetchFilteredRecipes();
  }, [debouncedFilters, currentPage, sortBy, fetchRecipes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedFilters, sortBy]);

  const handleFilterChange = useCallback((newFilters: Partial<RecipeFilters>) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-full">
      {/* --- DESKTOP FILTER PANEL --- */}
      <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 border-r p-6">
        <div className="h-full overflow-y-auto">
          <RecipeFilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
        </div>
      </aside>

      {/* --- MAIN CONTENT PANEL --- */}
      <main className="flex-grow overflow-y-auto p-4 sm:p-6">
        {/* --- MOBILE-ONLY HEADER --- */}
        <div className="lg:hidden mb-4">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search recipes..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="flex-grow"
            />
            <MobileFilterDrawer filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} />
          </div>
        </div>
        

        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
         
          <p className="hidden sm:block text-sm text-muted-foreground order-last sm:order-first">
            {!isLoading && `Showing ${recipes.length} of ${pagination.totalResults} recipes`}
          </p>
          <Tabs defaultValue="latest" value={sortBy} onValueChange={(value) => setSortBy(value as SortByType)}>
            <TabsList>
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* --- RECIPE GRID (Universal) --- */}
        {error && <p className="text-center text-destructive py-10">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : recipes.map((recipe, idx) => (
                // Including your BlurFade animation
                <BlurFade key={recipe.id} delay={0.25 + idx * 0.05} inView>
                  <RecipeCard recipe={recipe} />
                </BlurFade>
              ))}
        </div>

        {!isLoading && recipes.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">No Recipes Found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
        
        {!isLoading && recipes.length > 0 && (
          <AppPagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
        )}
      </main>
    </div>
  );
}