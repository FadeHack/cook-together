// src/pages/LandingPage.tsx

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { RecentRecipesList } from '@/components/shared/RecentRecipesList';
import { BookMarked, Search, PlusCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const features = [
    {
      icon: <PlusCircle className="h-8 w-8 text-primary" />,
      title: 'Share Your Creations',
      description: 'Easily post your favorite recipes with detailed ingredients and step-by-step instructions.',
    },
    {
      icon: <BookMarked className="h-8 w-8 text-primary" />,
      title: 'Save for Later',
      description: 'Never lose a recipe again. Save interesting finds from the community to your personal cookbook.',
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: 'Rate & Discover',
      description: 'Help the best recipes rise to the top with a simple rating system that highlights community favorites.',
    },
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: 'Find Anything',
      description: 'A powerful search that lets you find that perfect dish by title or even by the ingredients you have.',
    },
  ];

  return (
   <div className="h-full overflow-y-auto">
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
        {/* --- Hero Section with Animated Grid Background --- */}
        <section className="relative w-screen py-20 md:py-32 lg:py-40 bg-background overflow-hidden">
          {/* Animated Grid Pattern as background */}
          <AnimatedGridPattern
            numSquares={50}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              "[mask-image:radial-gradient(ellipse_at_center,white,transparent_100%)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
            )}
          />
          
          <div className="container mx-auto px-4 md:px-6 z-10">
            {/* The hero content is now in a two-column grid on large screens */}
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left Column: Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Share. Cook. Connect.
                </h1>
                <TypingAnimation
                  className="mt-4 text-lg md:text-xl text-muted-foreground"
                >
                  Your community cookbook, reimagined. 🧑🏻‍🍳
                </TypingAnimation>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg">
                    <Link to="/register">Get Started for Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/home">Explore Recipes</Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Animated List (hidden on smaller screens) */}
                <RecentRecipesList />
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-2">
                  {feature.icon}
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Final CTA Section --- */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Join the Club
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Become part of a growing community of home cooks sharing their passion for food.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/register">Start Sharing Today</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="flex items-center justify-center p-6 border-t">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CookTogether</p>
      </footer>
    </div>
    </div>
  );
}