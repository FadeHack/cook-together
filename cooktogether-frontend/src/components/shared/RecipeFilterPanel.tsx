// src/components/shared/RecipeFilterPanel.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star, RotateCcw } from "lucide-react";

// Define the shape of our filters
export interface RecipeFilters {
  search: string;
  minRating: number;
  maxCookTime: number; // in minutes
  maxPrepTime: number; // in minutes
}

interface RecipeFilterPanelProps {
  filters: RecipeFilters;
  onFilterChange: (newFilters: Partial<RecipeFilters>) => void;
  onReset: () => void;
}

export function RecipeFilterPanel({ filters, onFilterChange, onReset }: RecipeFilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Search</h3>
        <Input
          placeholder="Search by title or ingredient..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Rating</h3>
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((rating) => (
            <Button
              key={rating}
              variant={filters.minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange({ minRating: filters.minRating === rating ? 0 : rating })}
              className="flex items-center gap-1"
            >
              {rating} <Star className="w-4 h-4" />+
            </Button>
          ))}
        </div>
      </div>
      
      <Separator />

      <div>
        <Label htmlFor="prep-time" className="text-lg font-semibold">
          Max Prep Time: <span className="text-primary font-bold">{filters.maxPrepTime} mins</span>
        </Label>
        <Slider
          id="prep-time"
          max={120}
          step={5}
          value={[filters.maxPrepTime]}
          onValueChange={([value]) => onFilterChange({ maxPrepTime: value })}
          className="mt-4"
        />
      </div>
      
      <Separator />

      <div>
        <Label htmlFor="cook-time" className="text-lg font-semibold">
          Max Cook Time: <span className="text-primary font-bold">{filters.maxCookTime} mins</span>
        </Label>
        <Slider
          id="cook-time"
          max={180}
          step={5}
          value={[filters.maxCookTime]}
          onValueChange={([value]) => onFilterChange({ maxCookTime: value })}
          className="mt-4"
        />
      </div>

      <Separator />

      <Button variant="ghost" onClick={onReset} className="w-full">
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
}