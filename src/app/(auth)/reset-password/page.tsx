import { cookies } from 'next/headers'
import Link from 'next/link'
import { ResetPasswordForm } from './reset-form'
import { createServerClient } from '@supabase/ssr'

export default async function ResetPasswordPage() {
  const cookieStore = await cookies()
  const hasMarker = cookieStore.get('recovery_marker')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!hasMarker || !user) {
    return (
      <div className="wj-card p-8 text-center">
        <h2 className="font-display text-2xl font-extrabold text-ocean-deep">Invalid Session</h2>
        <p className="mt-2 mb-6 text-sm text-ink-soft">
          You do not have an active password recovery session.
        </p>
        <Link href="/forgot-password" className="wj-btn w-full">
          Request a new reset link
        </Link>
      </div>
    )
  }

  return <ResetPasswordForm />
}
