'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/app/ui/components/base/icons';
import { Radar7Logo } from '@/app/ui/logo/radar7-logo';
import { SidebarHistory } from '@/app/ui/components/sidebar-history';
import { SidebarUserNav } from '@/app/ui/components/sidebar-user-nav';
import { Button } from '@/app/ui/components/base/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar
} from '@/app/ui/components/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './base/tooltip';

export function AppSidebar ({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row items-center justify-between">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row items-center gap-3 group"
            >
              <div className="cursor-pointer rounded-md px-2 py-1 transition-all hover:bg-muted/50">
                <Radar7Logo
                  variant="compact"
                  className="w-40 transition-transform group-hover:scale-105" />
              </div>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="h-fit p-2"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
