'use client';

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
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <div
          className="glass pointer-events-auto rounded-xl px-6 py-3">
          <h1
            className="glass-text text-4xl font-semibold tracking-normal"
            style={{
              fontFamily   : 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              letterSpacing: '-0.02em'
            }}>
            Radar<span
              className="inline-block font-semibold"
              style={{
                fontSize            : '1.15em',
                background          : 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor : 'transparent',
                backgroundClip      : 'text',
                color               : 'transparent',
                filter              : 'drop-shadow(0 0 12px rgba(5, 150, 105, 0.5))'
              }}
            >7</span>
          </h1>
        </div>
      </div>

      {/* Top-right: Profile dropdown */}
      <div className="absolute right-4 top-4 z-10">
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
