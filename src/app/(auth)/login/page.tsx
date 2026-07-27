import { login } from './actions'
import Link from 'next/link'
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams
  
  let errorMessage = ''
  if (resolvedParams?.error) {
    if (resolvedParams.error === 'recovery_link_invalid') errorMessage = 'Invalid or expired recovery link. Please request a new one.'
    else if (resolvedParams.error === 'recovery_code_missing') errorMessage = 'No recovery code provided.'
    else if (resolvedParams.error === 'password_update_failed') errorMessage = 'Password update failed. Please try again.'
    else errorMessage = 'An authentication error occurred. Please try again.'
  }

  let successMessage = ''
  if ((resolvedParams as any)?.message === 'password_updated') {
    successMessage = 'Password updated successfully! Please log in.'
  }

  return (
    <div className="flex h-[80vh] items-center justify-center p-6">
      <form className="wj-card w-full max-w-md space-y-6 p-8 text-center">
        <h1 className="font-display text-3xl text-ocean-deep">Welcome Back! 🌴</h1>
        <p className="font-hand text-lg text-ink-soft">Enter your details to continue the adventure.</p>
        
        {successMessage && (
          <div className="rounded-lg bg-palm/20 p-3 text-sm font-bold text-palm-deep">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg bg-hibiscus/10 p-3 text-sm font-bold text-hibiscus-deep">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4 text-left">
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-2xl border-2 border-sand-deep bg-paper p-4 text-lg text-ink shadow-sm outline-none transition-all placeholder:text-ink-soft/60 focus:border-mango focus:ring-4 focus:ring-mango/20"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-2xl border-2 border-sand-deep bg-paper p-4 text-lg text-ink shadow-sm outline-none transition-all placeholder:text-ink-soft/60 focus:border-mango focus:ring-4 focus:ring-mango/20"
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm font-bold text-ocean hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <button formAction={login} className="wj-btn w-full text-lg">
          Sign In
        </button>
      </form>
    </div>
  )
}
