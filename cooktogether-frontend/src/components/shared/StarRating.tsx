// src/components/shared/StarRating.tsx
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // shadcn's utility for conditional classes

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({ rating, totalStars = 5, onRate, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = (rate: number) => {
    if (onRate) {
      onRate(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (onRate) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (onRate) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: totalStars }, (_, i) => {
        const starNumber = i + 1;
        const isFilled = starNumber <= (hoverRating || rating);
        return (
          <Star
            key={starNumber}
            className={cn(
              'w-6 h-6',
              isFilled ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300',
              onRate && 'cursor-pointer transition-transform hover:scale-125'
            )}
            onClick={() => handleRate(starNumber)}
            onMouseEnter={() => handleMouseEnter(starNumber)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
}