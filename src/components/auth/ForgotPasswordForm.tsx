'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">Lupa Password?</h1>
        <p className="text-neutral-600">Kami akan mengirim link reset ke email Anda</p>
      </div>

      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
            <p className="text-sm font-medium text-success-700">
              Email reset password telah dikirim ke {email}. Silakan cek email Anda.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors text-center block"
          >
            Kembali ke Login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? 'Sedang memproses...' : 'Kirim Link Reset'}
            </button>
          </form>

          <p className="text-center text-neutral-600">
            Ingat password Anda?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Kembali ke login
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
