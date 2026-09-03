'use client'

import { useState } from 'react'
import { submitInquiry } from './actions'

export default function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const res = await submitInquiry(formData)

    if (res.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(res.error || 'Unable to submit inquiry at this time.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-mango/10 rounded-2xl border border-mango/30">
        <span className="text-4xl block mb-3">✨</span>
        <h3 className="font-display text-2xl text-ocean-deep">Inquiry Received</h3>
        <p className="text-ink-soft mt-2 leading-relaxed">
          Thank you for reaching out. We will review your family inquiry and follow up directly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left" noValidate={false}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="full_name" className="block text-sm font-bold text-ocean-deep mb-1">
            Guardian Full Name *
          </label>
          <input
            required
            id="full_name"
            name="full_name"
            type="text"
            maxLength={100}
            placeholder="First and last name"
            className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none text-ink text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-ocean-deep mb-1">
            Guardian Email Address *
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            maxLength={120}
            placeholder="guardian@example.com"
            className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none text-ink text-sm"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="whatsapp_number" className="block text-sm font-bold text-ocean-deep mb-1">
            WhatsApp Number (Optional)
          </label>
          <input
            id="whatsapp_number"
            name="whatsapp_number"
            type="tel"
            maxLength={30}
            placeholder="+1 (555) 000-0000"
            className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none text-ink text-sm"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-bold text-ocean-deep mb-1">
            Country or Timezone *
          </label>
          <input
            required
            id="country"
            name="country"
            type="text"
            maxLength={80}
            placeholder="e.g., United States (Pacific Time) or Manila"
            className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none text-ink text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="learner_ages" className="block text-sm font-bold text-ocean-deep mb-1">
          Approximate Learner Age Range
        </label>
        <input
          id="learner_ages"
          name="learner_ages"
          type="text"
          maxLength={60}
          placeholder="e.g., ages 6 to 8, or mixed ages"
          className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none text-ink text-sm"
        />
        <p className="text-xs text-ink-soft mt-1">
          Please do not include child names or birth dates. This field is for curriculum planning only.
        </p>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-bold text-ocean-deep mb-1">
          Learning Interests or Family Goals
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Tell us about your interest in Filipino language, cultural heritage, character values, or Bible-based lessons."
          className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none text-ink text-sm"
        ></textarea>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-start gap-3">
          <input
            required
            type="checkbox"
            id="contact_consent"
            name="contact_consent"
            value="true"
            className="mt-1 w-4 h-4 rounded border-sand-deep accent-ocean-deep focus:ring-mango"
          />
          <label htmlFor="contact_consent" className="text-xs text-ink-soft leading-relaxed">
            I consent to being contacted by Wonder Journey regarding this informational inquiry.
          </label>
        </div>

        <div className="flex items-start gap-3">
          <input
            required
            type="checkbox"
            id="privacy_acknowledged"
            name="privacy_acknowledged"
            value="true"
            className="mt-1 w-4 h-4 rounded border-sand-deep accent-ocean-deep focus:ring-mango"
          />
          <label htmlFor="privacy_acknowledged" className="text-xs text-ink-soft leading-relaxed">
            I acknowledge the privacy notice below and understand that submitting this inquiry is not an enrollment.
          </label>
        </div>
      </div>

      {status === 'error' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
          {errorMessage || 'Unable to submit inquiry. Please check your entries and try again.'}
        </div>
      )}

      <button
        disabled={status === 'submitting'}
        type="submit"
        className="wj-btn w-full text-base py-3.5 transition-opacity disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
