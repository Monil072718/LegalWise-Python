import Link from "next/link";
import { ArrowRight, Shield, Star, Users } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden pt-20">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-50/50 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
          
          {/* Text Content */}
          <div className="max-w-2xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              #1 Trusted Legal Platform
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Expert Legal Help <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                Without Limits
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Connect with top-rated lawyers, manage your cases securely, and access a wealth of legal resources. Professional legal assistance is now just a click away.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/find-lawyer"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                Find a Lawyer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/ai-chat"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
              >
                Try AI Assistant
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                    <Shield className="w-4 h-4" />
                </div>
                <span>Verified Lawyers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-full text-amber-600">
                    <Star className="w-4 h-4" />
                </div>
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-full text-purple-600">
                    <Users className="w-4 h-4" />
                </div>
                <span>10k+ Clients</span>
              </div>
            </div>
          </div>
          
          {/* Image/Visual Content */}
          <div className="relative lg:h-full flex items-center justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-lg aspect-square">
               {/* Decorative Circle */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -z-10 blur-3xl"></div>
               
               {/* Main Card */}
               <div className="absolute top-10 left-0 w-full glass-panel rounded-2xl p-6 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500 z-10">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" alt="Lawyer" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h3 className="font-bold text-gray-900">James Wilson</h3>
                     <p className="text-blue-600 text-sm">Corporate Law Specialist</p>
                   </div>
                   <div className="ml-auto flex gap-1">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="h-2 bg-gray-100 rounded-full w-3/4"></div>
                   <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                 </div>
                 <div className="mt-4 flex gap-3">
                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">Verified</span>
                   <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Available</span>
                 </div>
               </div>
               
               {/* Floating Card 2 */}
               <div className="absolute -bottom-5 -right-5 w-2/3 glass-panel rounded-2xl p-4 transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 z-20 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">Case Status</span>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Trademark Reg.</p>
                      <p className="text-xs text-gray-500">Updated 2h ago</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
