import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function PublicHeader() {
  return (
    <header className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Scale className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900">LegalWise</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#lawyers" className="text-gray-600 hover:text-blue-600 font-medium">
            Find a Lawyer
          </Link>
          <Link href="/user/login" className="text-gray-600 hover:text-blue-600 font-medium">
            Sign In
          </Link>
          <Link 
            href="/user/register" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
