"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPassword() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    // Placeholder for actual reset logic
    // const formData = new FormData(e.currentTarget)
    // const email = formData.get('email') as string
    // await supabase.auth.resetPasswordForEmail(email)
    
    // Simulating API call for now
    setTimeout(() => setStatus('success'), 1000)
  }

  return (
    <div className="wj-card p-8">
      <h2 className="text-center font-display text-2xl font-extrabold text-ocean-deep">Reset Password</h2>
      <p className="mt-2 text-center text-sm text-ink-soft mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {status === 'success' ? (
        <div className="text-center bg-sand p-4 rounded-xl">
          <p className="text-sm font-bold text-ocean-deep">Check your email</p>
          <p className="text-xs text-ink-soft mt-1">If an account exists, a reset link has been sent.</p>
          <Link href="/login" className="wj-btn wj-btn-ghost w-full mt-4 text-sm">Return to Login</Link>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="text-sm font-bold text-ink-soft">Email</label>
            <input name="email" type="email" required className="wj-input mt-1 w-full" placeholder="you@example.com" />
          </div>

          {status === 'error' && <p className="text-sm text-red-500 font-bold">{errorMsg}</p>}

          <button disabled={status === 'loading'} className="wj-btn w-full">
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center mt-4 text-sm">
            <Link href="/login" className="text-ocean hover:underline font-bold">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
