'use server'
import { createClient } from '@/lib/supabase/server'

export async function getInquiries() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Check if teacher
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'teacher') return []

  const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'teacher') return false

  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id)
  return !error
}
