'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return redirect('/login?error=Invalid credentials')
  }

  // Fetch the authenticated user's role from the profiles table
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login?error=Authentication failed')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'teacher' && profile.role !== 'family')) {
    // Fail-closed: do not default to family
    await supabase.auth.signOut()
    return redirect('/login?error=Account not configured. Please contact your administrator.')
  }

  // Role-aware redirect
  if (profile.role === 'teacher') {
    return redirect('/teacher')
  }
  return redirect('/family')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}
