"use client"
import Link from 'next/link'
import { useState } from 'react'
import { submitInquiry } from './actions'

export default function LandingPage() {
  return (
    <div className="bg-paper min-h-screen">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl text-ocean-deep leading-tight max-w-4xl mx-auto drop-shadow-sm">
            Custom learning adventures designed around <span className="text-mango-deep">your family.</span>
          </h1>
          <div className="my-8 h-1 w-32 bg-mango rounded-full opacity-80 mx-auto" />
          <p className="text-xl md:text-2xl text-ink max-w-3xl mx-auto font-medium leading-relaxed">
            Wonder Journey combines personalized lessons, live teaching, interactive activities, family projects, progress tracking, and a private learning platform built around each learner’s needs.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="#contact" className="wj-btn text-xl px-10 py-5 w-full sm:w-auto shadow-md hover:-translate-y-1 transition-transform">
              Request a Custom Learning Experience
            </Link>
            <Link href="#features" className="wj-btn wj-btn-ghost text-xl px-10 py-5 w-full sm:w-auto border-2 border-ocean/20 bg-white/60 backdrop-blur-sm shadow-sm hover:-translate-y-1 transition-transform hover:bg-white">
              Explore Wonder Journey
            </Link>
          </div>
        </div>
        
        {/* Soft tropical background blobs & motifs */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-0" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
               backgroundSize: "200px 200px"
             }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-mango/10 via-ocean/10 to-transparent rounded-full blur-[100px] -z-10" />
      </section>

      {/* ── PRODUCT PREVIEW / SCREENSHOTS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-32">
        <div className="rounded-3xl border-8 border-white/80 shadow-2xl overflow-hidden bg-gradient-to-br from-ocean/5 to-mango/5 aspect-video relative flex items-center justify-center backdrop-blur-md transform hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
          
          {/* Subtle map overlay for depth */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20 Q 10 10 20 20 T 40 20' stroke='%23004060' fill='none' stroke-width='1' stroke-dasharray='2,2'/%3E%3C/svg%3E")`,
               backgroundSize: "80px 80px"
             }}
          />
          
          <div className="relative text-center p-12 bg-white/80 border-2 border-white rounded-3xl shadow-lg backdrop-blur-md max-w-2xl">
            <span className="text-7xl mb-6 block drop-shadow-md">🗺️</span>
            <h3 className="font-display text-4xl text-ocean-deep font-extrabold tracking-tight">Your Private Family Portal</h3>
            <p className="text-2xl text-ink-soft mt-4 font-medium">A beautifully crafted, ad-free environment just for your family.</p>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-4xl text-center text-ocean-deep mb-16">Everything you need to learn together</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              emoji="🎥"
              title="Live Interactive Classes"
              desc="Seamlessly integrated live video with interactive tools, quizzes, and digital whiteboards."
            />
            <FeatureCard 
              emoji="🗺️"
              title="Personalized Curriculum"
              desc="Lessons tailored to your family's interests, values, and cultural background."
            />
            <FeatureCard 
              emoji="🏅"
              title="Gamified Progress"
              desc="Earn XP, unlock badges, and collect passport stamps as you travel the world."
            />
            <FeatureCard 
              emoji="📖"
              title="Family Cookbook"
              desc="Learn culture through cuisine. Save recipes, add cooking photos, and build memories."
            />
            <FeatureCard 
              emoji="📚"
              title="Shared Journals"
              desc="Document reflections and stories in a private, permanent family archive."
            />
            <FeatureCard 
              emoji="🛡️"
              title="Custom Platform"
              desc="Not just a login. A branded, secure workspace built exclusively for your family or organization."
            />
          </div>
        </div>
      </section>

      {/* ── WHO IT IS FOR ── */}
      <section className="py-24 bg-ocean text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-4xl mb-6">Who uses Wonder Journey?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 p-6 rounded-2xl">
              <span className="text-4xl block mb-3">👨‍👩‍👧‍👦</span>
              <h3 className="font-display text-xl">Families</h3>
              <p className="text-white/80 mt-2 text-sm">Looking for guided, culturally rich learning experiences.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl">
              <span className="text-4xl block mb-3">🏡</span>
              <h3 className="font-display text-xl">Homeschoolers</h3>
              <p className="text-white/80 mt-2 text-sm">Seeking an organized, beautiful curriculum and tracking platform.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl">
              <span className="text-4xl block mb-3">⛪</span>
              <h3 className="font-display text-xl">Churches</h3>
              <p className="text-white/80 mt-2 text-sm">Deploying customized curriculum to their congregations.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl">
              <span className="text-4xl block mb-3">👩‍🏫</span>
              <h3 className="font-display text-xl">Private Tutors</h3>
              <p className="text-white/80 mt-2 text-sm">Wanting to offer a premium digital experience to their clients.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INQUIRY FORM ── */}
      <section id="contact" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="wj-card p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl text-ocean-deep">Start Your Journey</h2>
              <p className="font-hand text-xl text-ink-soft mt-2">Tell us about your educational needs, and we'll design a customized solution.</p>
            </div>
            
            <InquiryForm />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ emoji, title, desc }: { emoji: string, title: string, desc: string }) {
  return (
    <div className="wj-card p-6 border-2 border-transparent hover:border-mango/30 transition-colors">
      <span className="text-4xl mb-4 block">{emoji}</span>
      <h3 className="font-display text-xl text-ocean-deep">{title}</h3>
      <p className="font-hand text-ink-soft mt-2 text-lg leading-snug">{desc}</p>
    </div>
  )
}

function InquiryForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const formData = new FormData(e.currentTarget)
    formData.set('consent_given', 'true')
    
    const res = await submitInquiry(formData)
    if (res.success) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-mango/10 rounded-2xl border border-mango/20">
        <span className="text-5xl block mb-4">✨</span>
        <h3 className="font-display text-2xl text-ocean-deep">Inquiry Received!</h3>
        <p className="text-ink-soft mt-2">Thank you for reaching out. We will review your request and get back to you shortly to discuss your custom learning adventure.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-ocean-deep mb-1">Full Name</label>
          <input required name="full_name" type="text" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-ocean-deep mb-1">Email Address</label>
          <input required name="email" type="email" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-ocean-deep mb-1">WhatsApp Number (Optional)</label>
          <input name="whatsapp_number" type="tel" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-ocean-deep mb-1">Country / Timezone</label>
          <input required name="country" type="text" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-ocean-deep mb-1">I am looking for...</label>
        <select required name="interested_service" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none">
          <option value="">Select a service</option>
          <option value="Personalized Online Teaching">Personalized Online Teaching</option>
          <option value="Custom Lesson Planning">Custom Lesson Planning</option>
          <option value="Custom Educational Platform">Custom Educational Platform (Software only)</option>
          <option value="Teaching + Platform Package">Teaching + Platform Package</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-ocean-deep mb-1">I am a...</label>
          <select required name="client_type" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none">
            <option value="">Select identity</option>
            <option value="Family / Parent">Family / Parent</option>
            <option value="Homeschool Group">Homeschool Group</option>
            <option value="Church / Ministry">Church / Ministry</option>
            <option value="Tutor / Educator">Tutor / Educator</option>
            <option value="Learning Center">Learning Center</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-ocean-deep mb-1">Ages of Learners</label>
          <input name="learner_ages" type="text" placeholder="e.g. 5, 8, 12" className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-ocean-deep mb-1">Tell us about your educational goals or platform needs</label>
        <textarea required name="message" rows={4} className="w-full p-3 rounded-xl border-2 border-sand-deep bg-paper focus:border-mango focus:outline-none"></textarea>
      </div>

      <div className="flex gap-3">
        <input required type="checkbox" id="consent" className="mt-1 w-5 h-5 accent-mango" />
        <label htmlFor="consent" className="text-sm text-ink-soft">
          I consent to being contacted about my inquiry and agree to the privacy policy. My information will not be shared.
        </label>
      </div>

      {status === 'error' && (
        <div className="text-red-500 font-bold">Something went wrong. Please try again.</div>
      )}

      <button disabled={status === 'submitting'} type="submit" className="wj-btn w-full text-lg py-4">
        {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
