"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import UserSidebar from '../components/common/UserSidebar';
import LawyerSidebar from '../components/common/LawyerSidebar'; 
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

    // List of public routes that don't need authentication
    const publicRoutes = ['/', '/find-lawyer', '/contact', '/books', '/articles', '/ai-chat'];
    if (publicRoutes.includes(pathname)) {
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
    
    // 3. Lawyer Route Protection  
    if (isLawyerRoute) {
        const lawyerToken = sessionStorage.getItem('lawyerToken');
        const adminToken = sessionStorage.getItem('adminToken');
        
        // Allow admin token for /lawyers management page (not /lawyer/*)
        const token = lawyerToken || (pathname === '/lawyers' ? adminToken : null);
        
        if (!token) {
            console.log("No lawyer token, redirecting...");
            router.push('/login');
            return;
        }
        
        try {
            if (!user) {
                const decoded: any = jwtDecode(token);
                if (decoded.role === 'lawyer' && decoded.id) {
                    const profile = await api.getLawyer(decoded.id);
                    setUser({
                        ...profile,
                        name: profile.name,
                        role: 'lawyer'
                    });
                } else if (decoded.role === 'admin') {
                    // Admin accessing lawyer management page
                    setUser({
                        id: decoded.id,
                        name: decoded.sub || 'Admin',
                        email: decoded.sub || '',
                        role: 'admin'
                    });
                }
            }
            setLoading(false);
        } catch (e) {
            console.error("Auth check failed:", e);
            sessionStorage.removeItem('lawyerToken');
            router.push('/login');
        }
        return;
    }

    // 4. Admin Route Protection
    if (isAdminRoute || (!isUserRoute && !isLawyerRoute && !isAuthPage)) {
        const token = sessionStorage.getItem('adminToken');
        if (!token) {
            console.log("No admin token, redirecting...");
            router.push('/login');
            return;
        }
        
        try {
            if (!user) {
                const decoded: any = jwtDecode(token);
                // Set basic admin info from token
                setUser({
                    id: decoded.id,
                    email: decoded.sub,
                    name: 'Admin',
                    role: 'admin'
                });
            }
            setLoading(false);
        } catch (e) {
            console.error("Auth check failed:", e);
            sessionStorage.removeItem('adminToken');
            router.push('/login');
        }
        return;
    }
    
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
  const publicRoutes = ['/', '/find-lawyer', '/contact', '/books', '/articles', '/ai-chat'];

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {!isAuthPage && !publicRoutes.includes(pathname) && (isLawyerRoute ? (
        <LawyerSidebar isCollapsed={sidebarCollapsed} />
      ) : isUserRoute ? (
        <UserSidebar isCollapsed={sidebarCollapsed} />
      ) : (
        <Sidebar isCollapsed={sidebarCollapsed} />
      ))}
      
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {!isAuthPage && !publicRoutes.includes(pathname) && <Header user={user} onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />}
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
