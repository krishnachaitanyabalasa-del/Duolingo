'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import { LogIn, Sparkles, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginAsGuest } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.replace('/learn');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Google sign-in popup was closed before completing. Click again to retry, or continue as default learner.');
      } else if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        setError(
          '127.0.0.1 is not added to Authorized Domains in Firebase Console. Add 127.0.0.1 in Firebase Console -> Authentication -> Settings -> Authorized domains, or click "Continue as Default Learner" below.'
        );
      } else {
        setError(err?.message || 'Failed to sign in with Google. Click "Continue as Default Learner" below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await loginAsGuest();
      router.replace('/learn');
    } catch (err: any) {
      console.error('Guest login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md animate-bounce">
          🦉
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">
            Welcome to Duolingo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Sign in to save your 10-unit learning progress & sync across devices!
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-650 text-gray-700 dark:text-white font-bold py-3.5 px-6 rounded-2xl shadow-sm transition active:scale-98 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_4px_0_#15803d] active:translate-y-1 active:shadow-none transition uppercase tracking-wider text-sm disabled:opacity-50"
          >
            <UserCheck className="w-5 h-5" />
            <span>Continue as Default Learner</span>
          </button>
        </div>

        <p className="text-xs text-gray-400">
          By signing in, your 10-unit course path and unit test achievements are automatically saved to SQLite backend.
        </p>
      </div>
    </div>
  );
}
