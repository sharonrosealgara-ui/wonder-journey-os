"use client"
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    // Placeholder for actual reset logic
    // const formData = new FormData(e.currentTarget)
    // const password = formData.get('password') as string
    // await supabase.auth.updateUser({ password })
    
    // Simulating API call for now
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => router.push('/login'), 2000)
    }, 1000)
  }

  return (
    <div className="wj-card p-8">
      <h2 className="text-center font-display text-2xl font-extrabold text-ocean-deep">Create New Password</h2>
      <p className="mt-2 text-center text-sm text-ink-soft mb-6">
        Please enter your new password below.
      </p>

      {status === 'success' ? (
        <div className="text-center bg-sand p-4 rounded-xl">
          <p className="text-sm font-bold text-ocean-deep">Password Updated 🎉</p>
          <p className="text-xs text-ink-soft mt-1">Redirecting to login...</p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label className="text-sm font-bold text-ink-soft">New Password</label>
            <input name="password" type="password" required className="wj-input mt-1 w-full" placeholder="••••••••" minLength={6} />
          </div>

          {status === 'error' && <p className="text-sm text-red-500 font-bold">{errorMsg}</p>}

          <button disabled={status === 'loading'} className="wj-btn w-full">
            {status === 'loading' ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  )
}
