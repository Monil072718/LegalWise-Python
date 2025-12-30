"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PublicHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
              <Scale className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
              Legal<span className="text-blue-600">Wise</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:text-blue-600 ${
                  isActive(link.href) 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-l border-gray-200 h-6 mx-3"></div>
            
            <Link 
              href="/user/login" 
              className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 text-sm transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/user/register" 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 flex flex-col gap-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-lg text-sm font-medium ${
                isActive(link.href) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 my-2"></div>
          <Link 
            href="/user/login" 
            className="p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 text-center"
          >
            Sign In
          </Link>
          <Link 
            href="/user/register" 
            className="p-3 rounded-lg text-sm font-medium bg-blue-600 text-white text-center shadow-md"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
