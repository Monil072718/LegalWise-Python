"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import LawyerSidebar from '../components/LawyerSidebar'; 
import { jwtDecode } from 'jwt-decode';
import { User, X } from 'lucide-react';
import { api } from '../services/api';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();

  // Determine role based on path
  const isLawyerRoute = pathname?.startsWith('/lawyer');
  const isUserRoute = pathname?.startsWith('/user');
  const isAdminRoute = pathname?.startsWith('/admin');
  
  const isAuthPage = 
    pathname.includes('/login') || 
    pathname.includes('/register') || 
    pathname.includes('/forgot-password');

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // 1. If public auth page, just stop loading and render
    if (isAuthPage) {
        setLoading(false);
        return;
    }

    // 2. User Route Protection
    if (isUserRoute) {
        const token = sessionStorage.getItem('userToken');
        if (!token) {
            console.log("No user token, redirecting...");
            router.push('/user/login');
            return;
        }
        
        try {
            // Verify token/fetch user if not already loaded
            if (!user) {
                const decoded: any = jwtDecode(token);
                if (decoded.id) {
                     const profile = await api.getClient(decoded.id);
                     setUser({
                         ...profile,
                         name: profile.name,
                         role: 'client'
                     });
                }
            }
            setLoading(false);
        } catch (e) {
            console.error("Auth check failed:", e);
            sessionStorage.removeItem('userToken');
            router.push('/user/login');
        }
        return;
    }
    
    // 3. Admin/Lawyer Protection (simplified for now to existing logic)
    // ... allow existing logic if needed, but for now we focus on User panel stability
    setLoading(false); 
  };

  // While checking auth, show a spinner (prevent flash of content/redirects)
  if (loading) {
      return (
          <div className="flex h-screen items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
      );
  }

  // Render appropriate layout
  return (
    <div className="flex h-screen bg-gray-50 relative">
      {isLawyerRoute ? (
        <LawyerSidebar isCollapsed={sidebarCollapsed} />
      ) : isUserRoute ? (
        <UserSidebar isCollapsed={sidebarCollapsed} />
      ) : (
        <Sidebar isCollapsed={sidebarCollapsed} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header user={user} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
