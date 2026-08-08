'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  
  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const cookieStore = await cookies()
  const hasMarker = cookieStore.get('recovery_marker')

  if (!hasMarker) {
    return { error: "Invalid or expired recovery session. Please request a new reset link." }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    cookieStore.delete('recovery_marker')
    return { error: "Invalid or expired recovery session. Please request a new reset link." }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('Password update failed', { status: error.status, code: error.code })
    return { error: "Your password could not be updated. Please check the password requirements and try again." }
  }

  // Clear recovery marker and temporary session
  cookieStore.delete('recovery_marker')
  await supabase.auth.signOut()

  return redirect('/login?message=password_updated')
}
