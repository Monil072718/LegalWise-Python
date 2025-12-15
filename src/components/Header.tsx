
import { Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Header({ onToggleSidebar, user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 relative z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative hidden sm:block">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 lg:w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 sm:hidden">
            <Search className="w-5 h-5" />
          </button>
          
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user?.role === 'lawyer' ? 'bg-blue-600' : 'bg-gray-800'}`}>
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="text-sm hidden sm:block">
              <div className="font-medium">{user?.name || 'Loading...'}</div>
              <div className="text-gray-500 text-xs">{user?.email || '...'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}