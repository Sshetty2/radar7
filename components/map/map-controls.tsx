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
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

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
          className="pointer-events-auto px-6 py-3"
          style={GLASS_EFFECT_STYLE}>
          <h1
            className="text-4xl font-semibold tracking-normal text-white"
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
              className="h-10 w-10 rounded-2xl border-[rgba(35,34,34,0.59)] text-white hover:bg-white/10"
              style={GLASS_EFFECT_STYLE}
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border-[rgba(35,34,34,0.59)] text-white"
            style={GLASS_EFFECT_STYLE}
          >
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="hover:bg-white/10">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-white/10">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
