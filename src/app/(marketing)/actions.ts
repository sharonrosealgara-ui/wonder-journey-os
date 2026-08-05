'use server'
import { createClient } from '@/lib/supabase/server'

export async function submitInquiry(formData: FormData) {
  const supabase = await createClient()

  const data = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    whatsapp_number: formData.get('whatsapp_number'),
    country: formData.get('country'),
    interested_service: formData.get('interested_service'),
    client_type: formData.get('client_type'),
    learner_ages: formData.get('learner_ages'),
    requested_subjects: formData.get('requested_subjects'),
    preferred_schedule: formData.get('preferred_schedule'),
    platform_needs: formData.get('platform_needs'),
    estimated_start: formData.get('estimated_start'),
    message: formData.get('message'),
    consent_given: formData.get('consent_given') === 'true',
  }

  const { error } = await supabase.from('inquiries').insert([data])

  if (error) {
    console.error('Inquiry submission error:', error)
    return { success: false, error: 'Failed to submit inquiry.' }
  }

  return { success: true }
}
