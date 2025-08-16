// src/components/shared/MobileFilterDrawer.tsx

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { RecipeFilterPanel, type RecipeFilters } from './RecipeFilterPanel';
import { SlidersHorizontal } from 'lucide-react';

interface MobileFilterDrawerProps {
  filters: RecipeFilters;
  onFilterChange: (newFilters: Partial<RecipeFilters>) => void;
  onReset: () => void;
}

export function MobileFilterDrawer({ filters, onFilterChange, onReset }: MobileFilterDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="container mx-auto">
          <DrawerHeader>
            <DrawerTitle>Filter Recipes</DrawerTitle>
            <DrawerDescription>Adjust your preferences to find the perfect recipe.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <RecipeFilterPanel filters={filters} onFilterChange={onFilterChange} onReset={onReset} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Show Results</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}