import PublicLawyerList from '../../components/public/PublicLawyerList';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';

export default function FindLawyerPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Find Your Legal Expert</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Browse our network of qualified lawyers specialized in various fields of law.
            </p>
          </div>
        </div>
        <PublicLawyerList />
      </main>
      <PublicFooter />
    </div>
  );
}
