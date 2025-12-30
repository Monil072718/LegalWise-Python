"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: 'Find Lawyers', href: '/find-lawyer' },
    { name: 'Books', href: '/books' },
    { name: 'Articles', href: '/articles' },
    { name: 'AI Chat', href: '/ai-chat' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-lg py-4' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${isScrolled ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-700 to-indigo-600 shadow-blue-500/30'}`}>
              <Scale className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Legal<span className="text-blue-600">Wise</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100/50 shadow-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(link.href) 
                    ? 'text-blue-600 bg-blue-50/80 shadow-sm' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                   <motion.div 
                     layoutId="activeTab"
                     className="absolute inset-0 bg-blue-50 rounded-full -z-10"
                     transition={{ type: "spring", stiffness: 500, damping: 30 }}
                   />
                )}
              </Link>
            ))}
          </nav>
          
          
          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-100/50 shadow-sm">
            <Link 
              href="/user/login" 
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/user/register" 
              className="group px-5 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold shadow-lg shadow-gray-200 hover:shadow-xl hover:bg-blue-600 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
            <Link 
              href="/user/login" 
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
