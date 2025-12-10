import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LawyerManagement from './components/LawyerManagement';
import ClientManagement from './components/ClientManagement';
import CaseManagement from './components/CaseManagement';
import AppointmentCalendar from './components/AppointmentCalendar';
import NotificationCenter from './components/NotificationCenter';
import BillingPayments from './components/BillingPayments';
import Analytics from './components/Analytics';
import ContentManagement from './components/ContentManagement';
import HiringManagement from './components/HiringManagement';
import Settings from './components/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'lawyers':
        return <LawyerManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'cases':
        return <CaseManagement />;
      case 'appointments':
        return <AppointmentCalendar />;
      case 'notifications':
        return <NotificationCenter />;
      case 'billing':
        return <BillingPayments />;
      case 'analytics':
        return <Analytics />;
      case 'content':
        return <ContentManagement />;
      case 'hiring':
        return <HiringManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}
        
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isCollapsed={sidebarCollapsed}
        />
        
        <div className="flex-1 flex flex-col lg:ml-0">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className="flex-1 overflow-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;