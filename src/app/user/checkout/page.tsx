"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { CreditCard, Shield, Check } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const planName = searchParams.get('plan') || 'Basic';
  const price = searchParams.get('price') || '$0';
  const period = searchParams.get('period') || '/mo';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const userToken = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');
        if (!userToken) {
            showToast('You must be logged in to purchase a plan.', 'error');
            router.push('/login');
            return;
        }

        const decoded: any = jwtDecode(userToken);
        const userId = decoded.id;

        // Update client subscription
        await api.updateClient(userId, {
            subscription_plan: planName.toLowerCase(),
            is_premium: true
        });

        debugger; // Allow verify if needed

        showToast(`Successfully subscribed to ${planName} plan!`, 'success');
        
        // Force a small delay to allow toast to show and potential backend sync
        setTimeout(() => {
             router.push('/user/dashboard');
        }, 1500);

    } catch (error) {
        console.error('Purchase failed:', error);
        showToast('Purchase failed. Please try again.', 'error');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="mt-2 text-gray-600">Secure checkout for your LegalWise subscription</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-blue-900">{planName} Plan</span>
                    <span className="font-bold text-blue-600">{price}{period}</span>
                </div>
                <p className="text-sm text-blue-700">Billed monthly</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span>{price}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                <Shield className="w-4 h-4" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                      maxLength={3}
                      value={formData.cvc}
                      onChange={(e) => setFormData({...formData, cvc: e.target.value})}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  {loading ? 'Processing...' : `Pay ${price}`}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  By clicking Pay, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
