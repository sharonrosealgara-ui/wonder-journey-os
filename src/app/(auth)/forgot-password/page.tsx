"use client";
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getAppUrl } from '@/lib/url';

export default function ForgotPassword() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const supabase = createClient();
    
    // Build the secure PKCE callback URL
    const callbackUrl = new URL('/auth/callback', getAppUrl());
    callbackUrl.searchParams.set('next', '/reset-password');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl.toString(),
    });

    if (error) {
      // Do not expose whether the account exists
      // Rate limits or system errors can be caught here, but we default to a safe message
      console.error(error); // log internally if needed, but not exposing exact message to user
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again later.');
    } else {
      setStatus('success');
    }
  }

  return (
    <div className="wj-card p-8">
      <h2 className="text-center font-display text-2xl font-extrabold text-ocean-deep">Reset Password</h2>
      <p className="mt-2 mb-6 text-center text-sm text-ink-soft">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {status === 'success' ? (
        <div className="rounded-xl bg-sand p-4 text-center">
          <p className="text-sm font-bold text-ocean-deep">Check your email</p>
          <p className="mt-1 text-xs text-ink-soft">If an account exists for that email, a password-reset link has been sent.</p>
          <Link href="/login" className="wj-btn wj-btn-ghost mt-4 w-full text-sm">Return to Login</Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="text-sm font-bold text-ink-soft">Email</label>
            <input name="email" type="email" required className="wj-input mt-1 w-full" placeholder="you@example.com" />
          </div>

          {status === 'error' && <p className="text-sm font-bold text-red-500">{errorMsg}</p>}

          <button disabled={status === 'loading'} className="wj-btn w-full">
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="font-bold text-ocean hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
