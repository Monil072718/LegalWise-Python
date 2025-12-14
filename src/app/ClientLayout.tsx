'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
       {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        
        <Sidebar 
          isCollapsed={sidebarCollapsed}
        />
        
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
    </div>
  );
}
