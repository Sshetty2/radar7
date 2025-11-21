'use client';

import { Radar7Logo } from '@/app/ui/logo/radar7-logo';
import { IconButton } from '@/app/ui/components/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/ui/components/base/dropdown-menu';
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
            <IconButton>
              <User className="h-5 w-5" />
            </IconButton>
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
