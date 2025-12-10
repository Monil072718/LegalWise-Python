
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
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'lawyers', label: 'Lawyer Management', icon: UserCheck },
  { id: 'clients', label: 'Client Management', icon: Users },
  { id: 'cases', label: 'Case Management', icon: Scale },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
  { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  { id: 'content', label: 'Content Management', icon: BookOpen },
  { id: 'hiring', label: 'Hire Management', icon: Briefcase },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export default function Sidebar({ currentPage, onPageChange, isCollapsed }: SidebarProps) {
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
      
      <nav className="flex-1 p-2 sm:p-4">
        <ul className="space-y-1 sm:space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
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
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}