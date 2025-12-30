import PublicHeader from '../components/public/PublicHeader';
import Hero from '../components/public/Hero';
import PublicLawyerList from '../components/public/PublicLawyerList';
import PublicFooter from '../components/public/PublicFooter';

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <Hero />
        <PublicLawyerList />
      </main>
      <PublicFooter />
    </div>
  );
}
