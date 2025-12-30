import PublicLawyerList from '../../components/public/PublicLawyerList';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';

export default function FindLawyerPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <div className="relative bg-gray-900 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                    Our Professionals
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Legal Expert</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Connect with verified attorneys specializing in every field of law. From consultation to courtroom, we have the right expert for you.
                </p>
            </div>
        </div>
        <PublicLawyerList />
      </main>
      <PublicFooter />
    </div>
  );
}
