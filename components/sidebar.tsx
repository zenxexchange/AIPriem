'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useSidebar } from '@/hooks/use-sidebar';
import { NewChat } from '@/components/new-chat';
import { SidebarList } from '@/components/sidebar-list';
import { UserMenu } from '@/components/user-menu';
import SubscribeButton from '@/components/SubscribeButton'; // Import the new Subscribe Button

export function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const className = ""; // Define className or receive it as a prop if needed

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed left-0 top-0 z-20 size-full bg-background/60 backdrop-blur-sm"
          onClick={closeSidebar}
        ></div>
      )}
      <section
        data-state={isSidebarOpen ? 'open' : 'closed'}
        className={cn(
          'peer absolute inset-y-0 z-30 h-full w-[280px] -translate-x-full flex-col border-r bg-sidebar duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]',
          isMobile ? 'flex' : 'hidden'
        )}
        onClick={isMobile ? closeSidebar : undefined}
      >
        <NewChat />
        <SidebarList />
      

      <div className="p-2 flex flex-col items-center space-y-2 border-t border-gray-700">
        <UserMenu />
        <SubscribeButton />
  
      </div>
        
        
      </section>
    </>
  );
}