import Link from 'next/link';
import { Scale, Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  Legal<span className="text-blue-600">Wise</span>
                </span>
             </Link>
             <p className="text-gray-500 text-sm leading-relaxed mb-6">
               Empowering individuals and businesses with accessible, top-tier legal solutions. Your trusted partner in navigation the legal landscape.
             </p>
             <div className="flex items-center gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Twitter className="w-5 h-5" />
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
               </a>
             </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/find-lawyer" className="hover:text-blue-600 transition-colors">Find a Lawyer</Link></li>
              <li><Link href="/books" className="hover:text-blue-600 transition-colors">Legal Library</Link></li>
              <li><Link href="/articles" className="hover:text-blue-600 transition-colors">Articles & News</Link></li>
              <li><Link href="/ai-chat" className="hover:text-blue-600 transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Stay Updated</h4>
            <p className="text-gray-500 text-sm mb-4">Subscribe to our newsletter for the latest legal insights.</p>
            <form className="flex flex-col gap-3">
               <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" placeholder="Enter your email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm" />
               </div>
               <button type="button" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200">
                 Subscribe
               </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-gray-100 mt-16 pt-8 text-center text-sm text-gray-400">
           © {new Date().getFullYear()} LegalWise Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
