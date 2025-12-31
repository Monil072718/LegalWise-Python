'use client';

import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Scale, 
  Calendar, 
  Bell, 
  CreditCard, 
  BarChart3, 
  BookOpen, 
  Briefcase,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
}

// Main navigation configuration
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'lawyers', label: 'Lawyer Management', icon: UserCheck, href: '/lawyers' },
  { id: 'clients', label: 'Client Management', icon: Users, href: '/clients' },
  { id: 'cases', label: 'Case Management', icon: Scale, href: '/cases' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
  // { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' }, // Moved to Header
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard, href: '/billing' },
  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, href: '/analytics' },
  { id: 'books', label: 'Book Inventory', icon: BookOpen, href: '/admin/books' },
  { id: 'articles', label: 'Legal Articles', icon: FileText, href: '/articles' },
  { id: 'hiring', label: 'Hire Management', icon: Briefcase, href: '/hiring' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' }
];

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col fixed lg:relative z-40`}>
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h1 className={`font-bold text-lg sm:text-xl transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
          LegalAdmin
        </h1>
        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LA</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 flex flex-col p-2 sm:p-4">
        <ul className="space-y-1 sm:space-y-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`ml-3 transition-opacity duration-300 text-sm sm:text-base ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-4 border-t border-slate-800">
           <button
              onClick={() => {
                sessionStorage.removeItem('adminToken');
                window.location.href = '/login';
              }}
              className={`w-full flex items-center px-2 sm:px-3 py-2 sm:py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all duration-200`}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`ml-3 transition-opacity duration-300 text-sm sm:text-base ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
                Logout
              </span>
            </button>
        </div>
      </nav>
    </div>
  );
}