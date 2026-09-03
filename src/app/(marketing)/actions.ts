'use server'
import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { isInquiryFormEnabled, getInquiryPrivacyNoticeVersion } from '@/lib/inquiry-config'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export async function submitInquiry(formData: FormData) {
  // Gate 1: Application-level fail-closed check
  if (!isInquiryFormEnabled()) {
    return { success: false, error: 'Inquiry submissions are currently closed.' }
  }

  // Gate 2: Server-controlled notice version
  const noticeVersion = getInquiryPrivacyNoticeVersion()
  if (!noticeVersion) {
    return { success: false, error: 'Inquiry submissions are currently closed.' }
  }

  // Required consents
  const contactConsent = formData.get('contact_consent') === 'true'
  const privacyAcknowledged = formData.get('privacy_acknowledged') === 'true'

  if (!contactConsent || !privacyAcknowledged) {
    return {
      success: false,
      error: 'Please confirm contact consent and privacy acknowledgment before submitting.'
    }
  }

  // Input extraction and sanitization
  const rawFullName = formData.get('full_name')
  const rawEmail = formData.get('email')
  const rawCountry = formData.get('country')
  const rawWhatsapp = formData.get('whatsapp_number')
  const rawLearnerAges = formData.get('learner_ages')
  const rawMessage = formData.get('message')

  const fullName = typeof rawFullName === 'string' ? rawFullName.trim() : ''
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  const country = typeof rawCountry === 'string' ? rawCountry.trim() : ''
  const whatsapp = typeof rawWhatsapp === 'string' ? rawWhatsapp.trim() : ''
  const learnerAges = typeof rawLearnerAges === 'string' ? rawLearnerAges.trim() : ''
  const message = typeof rawMessage === 'string' ? rawMessage.trim() : ''

  // Length and format validation
  if (fullName.length < 1 || fullName.length > 100) {
    return { success: false, error: 'Please provide your full name (1 to 100 characters).' }
  }

  if (email.length < 5 || email.length > 120 || !EMAIL_REGEX.test(email)) {
    return { success: false, error: 'Please provide a valid email address.' }
  }

  if (country.length < 1 || country.length > 80) {
    return { success: false, error: 'Please provide your country or timezone (1 to 80 characters).' }
  }

  if (whatsapp.length > 30) {
    return { success: false, error: 'WhatsApp number cannot exceed 30 characters.' }
  }

  if (learnerAges.length > 60) {
    return { success: false, error: 'Learner age range cannot exceed 60 characters.' }
  }

  if (message.length > 1000) {
    return { success: false, error: 'Message cannot exceed 1000 characters.' }
  }

  try {
    const supabase = await createClient()

    // Call dedicated SECURITY DEFINER RPC with allowlisted parameters
    const { error } = await supabase.rpc('submit_inquiry', {
      p_full_name: fullName,
      p_email: email,
      p_whatsapp_number: whatsapp.length > 0 ? whatsapp : null,
      p_country: country,
      p_learner_ages: learnerAges.length > 0 ? learnerAges : null,
      p_message: message.length > 0 ? message : null,
      p_contact_consent: true,
      p_privacy_acknowledged: true,
      p_privacy_notice_version: noticeVersion,
    })

    if (error) {
      // Safe generic logging: zero PII or user input logged
      console.error('[INQUIRY_SUBMISSION_ERROR] RPC execution failed:', error.code || 'UNKNOWN_ERROR')
      return {
        success: false,
        error: 'Unable to submit inquiry at this time. Please verify your information and try again.'
      }
    }

    return { success: true }
  } catch (err: unknown) {
    // Safe generic logging: zero PII logged
    console.error('[INQUIRY_SUBMISSION_EXCEPTION] Caught exception during inquiry submission')
    return {
      success: false,
      error: 'Unable to submit inquiry at this time. Please try again later.'
    }
  }
}
