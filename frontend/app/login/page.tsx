'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import { User, AlertCircle, Loader2 } from 'lucide-react';
import { LoginLandscape } from '@/components/login/LoginLandscape';
import { FlyingDuoMascot } from '@/components/login/FlyingDuoMascot';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginAsGuest } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<'google' | 'guest' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setActiveAction('google');
    setError(null);
    try {
      await loginWithGoogle();
      router.replace('/learn');
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        setError('Sign-in popup was closed. Click again to retry, or continue as default learner.');
      } else if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        setError('Domain not authorized in Firebase Console. You can continue as Default Learner below.');
      } else {
        setError(err?.message || 'Failed to sign in with Google. You can continue as Default Learner below.');
      }
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setActiveAction('guest');
    setError(null);
    try {
      await loginAsGuest();
      router.replace('/learn');
    } catch (err: any) {
      console.error('Guest login error:', err);
      setError('Unable to initialize guest session. Please try again.');
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden py-10 px-4 select-none">
      {/* 1. Full-Bleed Duolingo Landscape Background */}
      <LoginLandscape />

      {/* 2. Top Header Section: Duolingo Logo & Tagline */}
      <div className="relative z-10 flex flex-col items-center text-center mb-6 sm:mb-8">
        <h1 className="text-4xl sm:text-[46px] font-black tracking-tight text-[#58cc02] lowercase leading-none drop-shadow-xs">
          duolingo
        </h1>
        <p className="text-sm sm:text-[15px] font-semibold text-[#5a6d7c] mt-2 tracking-tight">
          Learn languages. Build habits. Grow every day.
        </p>
      </div>

      {/* 3. Main Center Login Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100/90 p-7 sm:p-9 flex flex-col items-center text-center transition-all duration-200">
        {/* Flying Duo Mascot Illustration with Burst Rays & Sparkles */}
        <FlyingDuoMascot size={135} className="mb-2" />

        {/* Card Title */}
        <h2 className="text-2xl sm:text-[28px] font-black text-[#1e293b] tracking-tight">
          Welcome Back!
        </h2>

        {/* Card Subtitle */}
        <p className="text-xs sm:text-[13.5px] font-medium text-[#64748b] mt-2 max-w-[290px] leading-relaxed">
          Sign in to continue your learning journey and keep your progress safe.
        </p>

        {/* Error Alert (if any) */}
        {error && (
          <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-left text-xs text-red-600 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span className="flex-1 font-medium">{error}</span>
          </div>
        )}

        {/* Action Buttons Section */}
        <div className="w-full mt-6 space-y-3.5">
          {/* Button 1: Sign in with Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-2 border-[#e2e8f0] hover:border-[#cbd5e1] text-[#1e293b] font-bold py-3.5 px-6 rounded-2xl shadow-xs transition-all duration-150 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading && activeAction === 'google' ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            )}
            <span className="text-sm sm:text-[15px]">Sign in with Google</span>
          </button>

          {/* Divider: or */}
          <div className="w-full flex items-center my-3.5">
            <div className="flex-1 h-[1.5px] bg-[#e2e8f0]" />
            <span className="px-3 text-xs font-semibold text-[#94a3b8] lowercase">or</span>
            <div className="flex-1 h-[1.5px] bg-[#e2e8f0]" />
          </div>

          {/* Button 2: Continue as Default Learner */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-[#58cc02] hover:bg-[#4ea802] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_3px_0_0_#46a302] hover:shadow-[0_2px_0_0_#46a302] active:translate-y-0.5 active:shadow-none transition-all duration-150 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {loading && activeAction === 'guest' ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <User className="w-4.5 h-4.5 shrink-0 stroke-[2.4]" />
            )}
            <span className="text-sm sm:text-[15px]">Continue as Default Learner</span>
          </button>
        </div>

        {/* Bottom Disclaimer Note */}
        <p className="text-[11px] sm:text-[11.5px] text-[#94a3b8] leading-relaxed max-w-[320px] mt-6 font-normal">
          By signing in, your 10-unit course path and achievements are automatically saved to our secure backend.
        </p>
      </div>
    </div>
  );
}
