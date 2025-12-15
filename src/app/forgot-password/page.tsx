'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';

export default function UniversalForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(''); // For dev only

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await api.forgotPassword(email);
      setStatus('success');
      setMessage('Password reset instructions have been sent to your email.');
      if (response.token) {
           setToken(response.token);
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Failed to request password reset.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
            Enter your registered email address
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          {status === 'success' ? (
            <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
                    {message}
                </div>
                
                {/* Dev Only Link */}
                {token && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm break-all">
                        <strong>DEV ONLY:</strong><br/>
                        <Link href={`/reset-password?token=${token}`} className="text-blue-600 underline">
                            Click here to reset (Simulated Email Link)
                        </Link>
                    </div>
                )}
                
                <div className="text-center">
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Back to Login
                    </Link>
                </div>
            </div>
          ) : (
             <form className="space-y-6" onSubmit={handleSubmit}>
                {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm">
                    {message}
                </div>
                )}

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                    />
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${status === 'loading' ? 'opacity-75' : ''}`}
                >
                    {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
                </div>
                
                <div className="flex justify-center">
                    <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        Back to Login
                    </Link>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
