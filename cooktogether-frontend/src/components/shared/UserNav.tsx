// src/components/shared/UserNav.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';

export function UserNav() {
  const { user, logout } = useAuthStore();

  // If there's no user, don't render anything. This is a safety check.
  if (!user) {
    return null;
  }
  console.log(user.username)
  // Create avatar fallbacks from user's name (e.g., "John Doe" -> "JD")
  const initials =
    user.username
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* We can add user.photoURL here later if available */}
            
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* We can add links to Profile, Settings etc. here later */}
        <DropdownMenuItem onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}