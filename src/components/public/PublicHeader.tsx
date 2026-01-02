"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Menu, X, ChevronRight, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import ProfileModal from './ProfileModal';

function CartBadge() {
  const { totalItems } = useCart();
  if (totalItems === 0) return null;
  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
      {totalItems}
    </span>
  );
}

export default function PublicHeader() {

  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = sessionStorage.getItem('adminToken') || localStorage.getItem('adminToken');
      const lawyerToken = sessionStorage.getItem('lawyerToken') || localStorage.getItem('lawyerToken');
      const userToken = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');

      if (adminToken) {
        setIsLoggedIn(true);
        setUserRole('admin');
      } else if (lawyerToken) {
        setIsLoggedIn(true);
        setUserRole('lawyer');
      } else if (userToken) {
        setIsLoggedIn(true);
        setUserRole('user');
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    switch(userRole) {
      case 'admin': return '/admin/dashboard';
      case 'lawyer': return '/lawyer/dashboard';
      case 'user': return '/user/dashboard';
      default: return '/';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Lawyers', href: '/find-lawyer' },
    { name: 'Books', href: '/books' },
    { name: 'Articles', href: '/articles' },
    { name: 'AI Chat', href: '/ai-chat' },
    { name: 'Contact', href: '/contact' },
  ];

  const isDarkHeader = ['/find-lawyer', '/contact', '/books'].includes(pathname || '');
  const textColor = !isScrolled && isDarkHeader ? 'text-white' : 'text-gray-700';
  const hoverColor = !isScrolled && isDarkHeader ? 'hover:text-blue-100' : 'hover:text-blue-600';
  const logoColor = !isScrolled && isDarkHeader ? 'text-white' : 'text-gray-900';
  const logoSuffix = !isScrolled && isDarkHeader ? 'text-blue-200' : 'text-blue-600';

  return (
    <>
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - kept same */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${!isScrolled && isDarkHeader ? 'bg-white/20 backdrop-blur' : (isScrolled ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-700 to-indigo-600 shadow-blue-500/30')}`}>
              <Scale className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${logoColor}`}>
              Legal<span className={logoSuffix}>Wise</span>
            </span>
          </Link>
          
          {/* Desktop Nav - kept same */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.href) 
                    ? (!isScrolled && isDarkHeader ? 'bg-white/20 text-white backdrop-blur-sm' : 'text-blue-600 bg-blue-50 shadow-sm')
                    : `${textColor} ${hoverColor}`
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
             {/* Cart Button */}
             <Link href="/user/cart" className={`relative p-2 rounded-full transition-colors ${textColor} ${hoverColor}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <CartBadge />
             </Link>

            {isLoggedIn ? (
                <div className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                            !isScrolled && isDarkHeader 
                                ? 'bg-white/10 text-white hover:bg-white/20' 
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                            <User className="w-4 h-4" />
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                            >
                                <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Signed in as</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">{userRole === 'admin' ? 'Administrator' : userRole === 'lawyer' ? 'Professional' : 'Client'}</p>
                                </div>

                                <Link 
                                    href={getDashboardLink()}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                
                                <button
                                    onClick={() => {
                                        setIsUserMenuOpen(false);
                                        setShowProfileModal(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                                >
                                    <User className="w-4 h-4" />
                                    Edit Profile
                                </button>

                                <div className="h-px bg-gray-50 my-1"></div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <>
                    <Link 
                      href="/login" 
                      className={`px-4 py-2 text-sm font-semibold transition-colors ${textColor} ${hoverColor}`}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/user/register" 
                      className={`group px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 ${
                          !isScrolled && isDarkHeader 
                            ? 'bg-white text-blue-600' 
                            : 'bg-gray-900 text-white hover:bg-blue-600'
                      }`}
                    >
                      Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </>
            )}
            
            {/* ... */}

          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={`lg:hidden p-2 rounded-lg transition-colors ${!isScrolled && isDarkHeader ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </motion.header>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="fixed top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-hidden z-40 lg:hidden"
        >
          <div className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-4 rounded-xl text-base font-medium flex items-center justify-between ${
                  isActive(link.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
                <ChevronRight className={`w-4 h-4 ${isActive(link.href) ? 'text-blue-600' : 'text-gray-300'}`} />
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            {isLoggedIn ? (
                <>
                    <Link 
                        href={getDashboardLink()}
                        className="p-4 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 text-center flex items-center justify-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <button 
                        onClick={() => {
                            setMobileMenuOpen(false);
                            setShowProfileModal(true);
                        }}
                        className="p-4 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 text-center flex items-center justify-center gap-2 w-full"
                    >
                        <User className="w-5 h-5" /> Edit Profile
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="p-4 rounded-xl text-base font-bold bg-gray-100 text-red-600 text-center shadow-sm hover:bg-red-50"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link 
                      href="/login" 
                      className="p-4 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 text-center"
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/user/register" 
                      className="p-4 rounded-xl text-base font-bold bg-blue-600 text-white text-center shadow-md"
                    >
                      Get Started Now
                    </Link>
                </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Profile Modal */}
    <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
