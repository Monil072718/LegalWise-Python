"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import LawyerSidebar from '../components/LawyerSidebar';
import Header from '../components/Header';
import {jwtDecode} from 'jwt-decode';
import { api } from '../services/api';
import { X } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Route Groups
  // FIX: Use '/lawyer/' with trailing slash to avoid matching '/lawyers' (Admin route)
  const isLawyerRoute = pathname === '/lawyer' || pathname?.startsWith('/lawyer/');
  const isAuthPage = pathname === '/login' || pathname === '/lawyer/login' || pathname === '/lawyer/register' || pathname === '/admin/login';
  
  // Auth Protection & User Fetching
  useEffect(() => {
    console.log('ClientLayout path:', pathname);

    const checkAuth = async () => {
      // Admin Protection
      if (!isLawyerRoute && !isAuthPage) {
        const adminToken = localStorage.getItem('adminToken');
        console.log('Checking Admin Token:', adminToken);
        if (!adminToken) {
          console.log('No admin token, redirecting to /login');
          router.push('/login');
          return; // Stop further execution
        }
        try {
            const decoded: any = jwtDecode(adminToken);
            setUser({
                name: 'Admin User', // Hardcoded as we don't have Admin API yet
                email: decoded.sub || 'admin@legalwise.com',
                role: 'admin'
            });
        } catch (e) {
            console.error(e);
        }
      }
      
      // Lawyer Protection 
      if (isLawyerRoute && !isAuthPage) {
         const lawyerToken = localStorage.getItem('lawyerToken');
         if (!lawyerToken) {
           router.push('/login');
           return;
         }
         try {
             const decoded: any = jwtDecode(lawyerToken);
             if (decoded.id) {
                 // Fetch full lawyer profile to get name
                 try {
                     const lawyerProfile = await api.getLawyer(decoded.id);
                     setUser({
                         name: lawyerProfile.name,
                         email: lawyerProfile.email,
                         role: 'lawyer'
                     });
                 } catch (err) {
                     console.error("Failed to fetch lawyer profile", err);
                     // Fallback to token data
                     setUser({
                         name: 'Lawyer',
                         email: decoded.sub,
                         role: 'lawyer'
                     });
                 }
             }
         } catch(e) {
             console.error(e);
         }
      }
    };

    checkAuth();
  }, [pathname, isLawyerRoute, isAuthPage, router]);

  // Welcome Modal Logic
  useEffect(() => {
      if (user && sessionStorage.getItem('showWelcome') === 'true') {
          setShowWelcome(true);
          sessionStorage.removeItem('showWelcome');
          // Auto hide after 3 seconds
          setTimeout(() => setShowWelcome(false), 3000);
      }
  }, [user]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Welcome Modal / Toast */}
      {showWelcome && user && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className="bg-white border-l-4 border-blue-600 shadow-xl rounded-lg p-4 pr-10 relative flex items-center min-w-[300px]">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <span className="text-2xl">👋</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Welcome back!</h3>
                    <p className="text-gray-600 text-sm">Good to see you, {user.name.split(' ')[0]}.</p>
                </div>
                <button 
                    onClick={() => setShowWelcome(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}

      {isLawyerRoute ? (
        <LawyerSidebar isCollapsed={sidebarCollapsed} />
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
