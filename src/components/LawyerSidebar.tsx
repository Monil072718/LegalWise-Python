'use client';

import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  Calendar, 
  MessageSquare, 
  Bell, 
  CreditCard, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isCollapsed: boolean;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/lawyer/dashboard' },
  { id: 'clients', label: 'My Clients', icon: Users, href: '/lawyer/clients' },
  { id: 'cases', label: 'Case Management', icon: Scale, href: '/lawyer/cases' },
  { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/lawyer/appointments' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/lawyer/messages' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/lawyer/notifications' },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard, href: '/lawyer/billing' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/lawyer/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/lawyer/settings' }
];

export default function LawyerSidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col fixed lg:relative z-40`}>
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <h1 className={`font-bold text-lg sm:text-xl transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
          Lawyer Panel
        </h1>
        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LP</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 flex flex-col p-2 sm:p-4">
        <ul className="space-y-1 sm:space-y-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/lawyer/dashboard' && pathname.startsWith(item.href));
            
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
                sessionStorage.removeItem('lawyerToken');
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
