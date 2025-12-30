"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';



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

  const isDarkHeader = ['/find-lawyer', '/contact'].includes(pathname);
  const textColor = !isScrolled && isDarkHeader ? 'text-white' : 'text-gray-700';
  const hoverColor = !isScrolled && isDarkHeader ? 'hover:text-blue-100' : 'hover:text-blue-600';
  const logoColor = !isScrolled && isDarkHeader ? 'text-white' : 'text-gray-900';
  const logoSuffix = !isScrolled && isDarkHeader ? 'text-blue-200' : 'text-blue-600';

  return (
    <>
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg py-4 border-b border-gray-100' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${!isScrolled && isDarkHeader ? 'bg-white/20 backdrop-blur' : (isScrolled ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-700 to-indigo-600 shadow-blue-500/30')}`}>
              <Scale className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${logoColor}`}>
              Legal<span className={logoSuffix}>Wise</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
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

            <Link 
              href="/user/login" 
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
