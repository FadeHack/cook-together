// src/components/shared/ErrorDisplay.tsx
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
}

export function ErrorDisplay({
  title = "Oops! Something went wrong.",
  message = "An unexpected error occurred. Please try refreshing the page.",
}: ErrorDisplayProps) {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground max-w-md">{message}</p>
      </div>
    </div>
  );
}