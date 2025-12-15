'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';

export default function UniversalForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setResetToken] = useState(''); // Token received after verifying OTP
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.forgotPassword(email);
      setStatus('success');
      setMessage('OTP has been sent to your email.');
      setStep(2); // Move to OTP step
      setStatus('idle');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Email not registered.');
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await api.verifyOTP({ email, otp });
      setResetToken(response.token);
      setStep(3); // Move to Password step
      setStatus('idle');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Invalid or expired OTP.');
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
        setStatus('error');
        setMessage("Passwords don't match");
        return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await api.resetPassword({ token, new_password: newPassword });
      setStatus('success');
      setMessage('Password reset successfully!');
      setTimeout(() => {
          router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
           {step === 1 && "Enter your registered email address"}
           {step === 2 && `Enter the OTP sent to ${email}`}
           {step === 3 && "Set your new password"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100 animate-fade-in-up">
            
            {(status === 'error' || (status === 'success' && step === 3)) && (
                <div className={`mb-4 p-4 rounded-md text-sm ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                </div>
            )}

            {step === 1 && (
                <form className="space-y-6" onSubmit={handleStep1}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Sending...' : 'Send OTP'}
                    </button>
                    <div className="text-center">
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Back to Login</Link>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form className="space-y-6" onSubmit={handleStep2}>
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">One-Time Password (OTP)</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Digits only
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm tracking-widest text-center text-2xl"
                            placeholder="------"
                        />
                    </div>
                     <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <div className="text-center">
                         <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                             Change Email
                         </button>
                    </div>
                </form>
            )}

            {step === 3 && (status !== 'success') && (
                <form className="space-y-6" onSubmit={handleStep3}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {status === 'loading' ? 'Resetting...' : 'Set New Password'}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}
