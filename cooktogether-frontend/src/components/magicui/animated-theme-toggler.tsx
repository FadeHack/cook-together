// src/components/magicui/animated-theme-toggler.tsx

"use client";

import { useTheme } from "@/components/theme-provider"; // 1. Use your theme provider
import { cn } from "@/lib/utils";
import { Moon, SunDim } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const { theme, toggleTheme } = useTheme(); // 2. Get state from the provider
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Add a mounting state to prevent hydration errors with the icon
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const changeTheme = async () => {
    if (!buttonRef.current || !document.startViewTransition) {
      // Fallback for older browsers
      toggleTheme();
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        
        toggleTheme();
      });
    });

    await transition.ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return (
    <button ref={buttonRef} onClick={changeTheme} className={cn(className)}>
      {mounted && (theme === "dark" ? <SunDim /> : <Moon />)}
    </button>
  );
};