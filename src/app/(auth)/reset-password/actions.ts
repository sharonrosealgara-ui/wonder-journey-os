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

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    // Treat Supabase password policy errors safely
    console.error("Password update failed:", error)
    return { error: "Password update failed. It may be too weak or the session expired." }
  }

  // Clear recovery marker and temporary session
  cookieStore.delete('recovery_marker')
  await supabase.auth.signOut()

  return redirect('/login?error=Password updated successfully! Please log in.')
}
