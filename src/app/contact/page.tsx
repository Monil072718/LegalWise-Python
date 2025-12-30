"use client";

import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main className="pt-20">
        <div className="relative bg-gray-900 py-24 sm:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                    Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Touch</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Have a question or need legal assistance? Our team is available 24/7 to help you navigate your legal journey.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-500 mb-4">For general inquiries and support</p>
                <a href="mailto:support@legalwise.com" className="text-blue-600 font-bold hover:underline">support@legalwise.com</a>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                    <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-500 mb-4">Mon-Fri from 9am to 6pm EST</p>
                <a href="tel:+15551234567" className="text-indigo-600 font-bold hover:underline">+1 (555) 123-4567</a>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-500 mb-4">123 Legal Avenue, Suite 100</p>
                <span className="text-purple-600 font-bold">New York, NY 10001</span>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
             <div className="md:w-1/2 bg-gray-50 p-12 lg:p-16 flex flex-col justify-center">
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-4">
                        Contact Form
                    </span>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Send us a Message</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Fill out the form and our team will get back to you within 24 hours. We respect your privacy and confidentiality.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-600">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <span>Instant support for urgent queries</span>
                    </div>
                </div>
             </div>

             <div className="md:w-1/2 p-12 lg:p-16">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                            <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                            <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Doe" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                        <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="How can we help?"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" /> Send Message
                    </button>
                </form>
             </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
