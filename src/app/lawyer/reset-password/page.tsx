'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../services/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setStatus('error');
        setMessage("Passwords don't match");
        return;
    }
    if (!token) {
        setStatus('error');
        setMessage("Invalid or missing token");
        return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await api.resetPassword({ token, new_password: password });
      setStatus('success');
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Failed to reset password.');
    }
  };

  if (!token) {
      return (
          <div className="text-center text-red-600">
              Invalid or missing reset token. Please request a new link.
          </div>
      );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
        {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-sm">
            {message}
        </div>
        )}
        {status === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md text-sm">
            {message}
        </div>
        )}

        <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
        </label>
        <div className="mt-1">
            <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
        </div>
        
        <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
        </label>
        <div className="mt-1">
            <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
        </div>
        </div>

        <div>
        <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${status === 'loading' ? 'opacity-75' : ''}`}
        >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
        </button>
        </div>
    </form>
  );
}

export default function LawyerResetPassword() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           <Suspense fallback={<div>Loading...</div>}>
             <ResetPasswordForm />
           </Suspense>
        </div>
      </div>
    </div>
  );
}
