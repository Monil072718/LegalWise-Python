import Link from 'next/link';
import SubscriptionSection from '../../components/public/SubscriptionSection';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SubscriptionSection />
      <div className="text-center pb-12 -mt-12 relative z-10">
        <Link href="/" className="text-base font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
