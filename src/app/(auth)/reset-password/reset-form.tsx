"use client"
import { useState } from 'react'
import { resetPassword } from './actions'

export function ResetPasswordForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    
    const formData = new FormData(e.currentTarget)
    const res = await resetPassword(formData)
    
    // Server action redirect throws a special error which Next.js catches to perform the redirect,
    // so if execution reaches here, it means we got a validation error object back.
    if (res?.error) {
      setStatus('error')
      setErrorMsg(res.error)
    }
  }

  return (
    <div className="wj-card p-8">
      <h2 className="text-center font-display text-2xl font-extrabold text-ocean-deep">Create New Password</h2>
      <p className="mt-2 text-center text-sm text-ink-soft mb-6">
        Please enter your new password below.
      </p>

      <form className="space-y-4" onSubmit={handleReset}>
        <div>
          <label className="text-sm font-bold text-ink-soft">New Password</label>
          <input 
            name="password" 
            type="password" 
            required 
            className="wj-input mt-1 w-full" 
            placeholder="••••••••" 
            minLength={8} 
          />
        </div>
        
        <div>
          <label className="text-sm font-bold text-ink-soft">Confirm Password</label>
          <input 
            name="confirmPassword" 
            type="password" 
            required 
            className="wj-input mt-1 w-full" 
            placeholder="••••••••" 
            minLength={8} 
          />
        </div>

        {status === 'error' && <p className="text-sm text-red-500 font-bold">{errorMsg}</p>}

        <button disabled={status === 'loading'} className="wj-btn w-full">
          {status === 'loading' ? 'Saving...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
