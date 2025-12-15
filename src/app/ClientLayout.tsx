"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import LawyerSidebar from '../components/LawyerSidebar';
import Header from '../components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Route Groups
  const isLawyerRoute = pathname?.startsWith('/lawyer');
  const isAuthPage = pathname === '/lawyer/login' || pathname === '/lawyer/register' || pathname === '/admin/login';
  
  // Auth Protection
  useEffect(() => {
    // Admin Protection
    if (!isLawyerRoute && !isAuthPage) {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        router.push('/admin/login');
      }
    }
  }, [pathname, isLawyerRoute, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {isLawyerRoute ? (
        <LawyerSidebar isCollapsed={sidebarCollapsed} />
      ) : (
        <Sidebar isCollapsed={sidebarCollapsed} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
