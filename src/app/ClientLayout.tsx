"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import LawyerSidebar from '../components/LawyerSidebar';
import Header from '../components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const isLawyerRoute = pathname?.startsWith('/lawyer');
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');

  // If it's an auth page, render simplified layout
  if (isAuthPage) {
    return <main className="min-h-screen bg-gray-50">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
       {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        
        {isLawyerRoute ? (
          <LawyerSidebar isCollapsed={sidebarCollapsed} />
        ) : (
          <Sidebar isCollapsed={sidebarCollapsed} />
        )}
        
        
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
    </div>
  );
}
