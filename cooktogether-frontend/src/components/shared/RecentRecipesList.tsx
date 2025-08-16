// src/components/shared/RecentRecipesList.tsx

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

// Fictional data that looks like new recipe notifications
let notifications: Item[] = [
  {
    name: "New Recipe Added!",
    description: "Sarah's Classic Lasagna",
    time: "2m ago",
    icon: "🍝",
    color: "#F59E0B", // Amber
  },
  {
    name: "New Recipe Added!",
    description: "John's Lemon Herb Chicken",
    time: "5m ago",
    icon: "🍗",
    color: "#84CC16", // Lime
  },
  {
    name: "New Recipe Added!",
    description: "Maria's Fudgy Brownies",
    time: "10m ago",
    icon: "🍫",
    color: "#8B5CF6", // Violet
  },
  {
    name: "New Recipe Added!",
    description: "David's Vegan Curry",
    time: "15m ago",
    icon: "🍛",
    color: "#10B981", // Emerald
  },
  {
    name: "New Recipe Added!",
    description: "Emily's Shrimp Pasta",
    time: "20m ago",
    icon: "🍤",
    color: "#EF4444", // Red
  },
  {
    name: "New Recipe Added!",
    description: "Michael's Caprese Salad",
    time: "25m ago",
    icon: "🥗",
    color: "#3B82F6", // Blue
  },
];

// Duplicate the notifications to ensure the list is long enough for a smooth infinite scroll
notifications = Array.from({ length: 20 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: color }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function RecentRecipesList() {
  return (
    <div
      className={cn(
        "relative flex h-[300px] md:h-[500px] w-full flex-col overflow-hidden p-2 shadow-inner",
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}