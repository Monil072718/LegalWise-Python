import { 
  LayoutDashboard, 
  Search, 
  Scale, 
  CreditCard, 
  BookOpen, 
  FileText,
  LogOut,
  Settings,
  Clock,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserSidebarProps {
  isCollapsed: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/user/dashboard' },
  { icon: Search, label: 'Find a Lawyer', href: '/user/lawyers' },
  { icon: Clock, label: 'My Appointments', href: '/user/appointments' },
  { icon: MessageSquare, label: 'Chat', href: '/user/chat' },
  { icon: Scale, label: 'My Cases', href: '/user/cases' },
  { icon: CreditCard, label: 'Payments', href: '/user/payments' },
  { icon: BookOpen, label: 'Legal Books', href: '/user/books' },
  { icon: FileText, label: 'Legal Articles', href: '/user/articles' },
  { icon: Settings, label: 'Settings', href: '/user/settings' },
];

export default function UserSidebar({ isCollapsed }: UserSidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    window.location.href = '/user/login';
  };

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-center">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          L
        </div>
        {!isCollapsed && <span className="ml-3 font-bold text-xl text-gray-800">LegalWise</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

       <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3 font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
