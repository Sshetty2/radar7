'use client';

import { Radar7Logo } from '@/components/logo/radar7-logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MapControls () {
  const router = useRouter();

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    router.push('/login');
  };

  return (
    <>
      {/* Top-left: App logo */}
      <div className="pointer-events-none absolute left-10 top-6 z-10">
        <div className="glass pointer-events-auto rounded-xl px-4 py-3">
          <Radar7Logo
            className="h-15" />
        </div>
      </div>

      {/* Top-right: Profile dropdown */}
      <div className="absolute right-6 top-6 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="glass h-11 w-11 cursor-pointer rounded-xl glass-text hover:bg-secondary/50 hover:scale-105 dark:hover:bg-white/15 transition-all duration-200"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="glass w-48 glass-text"
          >
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer hover:bg-secondary/50 dark:hover:bg-white/15 transition-all duration-200">
              <Settings className="mr-2 h-4 w-4 transition-all duration-200" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer hover:bg-secondary/50 dark:hover:bg-white/15 transition-all duration-200">
              <LogOut className="mr-2 h-4 w-4 transition-all duration-200" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
