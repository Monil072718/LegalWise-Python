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
  // FIX: Use '/lawyer/' with trailing slash to avoid matching '/lawyers' (Admin route)
  const isLawyerRoute = pathname === '/lawyer' || pathname?.startsWith('/lawyer/');
  const isAuthPage = pathname === '/lawyer/login' || pathname === '/lawyer/register' || pathname === '/admin/login';
  
  // Auth Protection
  useEffect(() => {
    console.log('ClientLayout path:', pathname);
    console.log('isLawyerRoute:', isLawyerRoute);
    console.log('isAuthPage:', isAuthPage);

    // Admin Protection
    if (!isLawyerRoute && !isAuthPage) {
      const adminToken = localStorage.getItem('adminToken');
      console.log('Checking Admin Token:', adminToken);
      if (!adminToken) {
        console.log('No admin token, redirecting to /admin/login');
        router.push('/admin/login');
        return; // Stop further execution
      }
    }
    
    // Lawyer Protection 
    if (isLawyerRoute && !isAuthPage) {
       const lawyerToken = localStorage.getItem('lawyerToken');
       console.log('Checking Lawyer Token:', lawyerToken);
       if (!lawyerToken) {
         console.log('No lawyer token, redirecting to /lawyer/login');
         router.push('/lawyer/login');
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
