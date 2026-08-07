"use client";
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPassword() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    const supabase = createClient();
    
    // Build the secure PKCE callback URL
    const callbackUrl = new URL('/auth/callback', window.location.origin);
    callbackUrl.searchParams.set('next', '/reset-password');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackUrl.toString(),
    });

    if (error) {
      console.error('Password reset request failed', { status: error.status, code: error.code });
      setStatus('error');
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
          <p className="mt-1 text-sm text-ink-soft">If an account exists for that email, a password-reset link has been sent.</p>
          <Link href="/login" className="wj-btn wj-btn-ghost mt-4 w-full text-sm">Return to Login</Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleReset}>
          {status === 'error' && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 text-center font-medium">
              We could not send the password reset email. Please try again shortly.
            </div>
          )}
          <div>
            <label className="text-sm font-bold text-ink-soft">Email</label>
            <input name="email" type="email" required className="wj-input mt-1 w-full" placeholder="you@example.com" />
          </div>

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
