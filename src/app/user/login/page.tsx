"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';
import { Mail, Lock } from 'lucide-react';

export default function UserLogin() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Clear any existing tokens when visiting login page to ensure fresh start
  useEffect(() => {
      sessionStorage.removeItem('userToken');
      localStorage.removeItem('userToken');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.email);
      const response = await api.loginClient(formData);
      
      if (response && response.access_token) {
          sessionStorage.setItem('userToken', response.access_token);
          
          showToast('Login successful!', 'success');
          
          // Check for redirect param
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get('redirect');
          
          if (redirect) {
              window.location.href = redirect;
          } else {
              window.location.href = '/user/dashboard'; 
          }
      } else {
          throw new Error('No access token received');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      showToast(error.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your Client Account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              New to LegalWise?{' '}
              <Link 
                href={`/user/register${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`} 
                className="text-blue-600 hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}
