'use client'

import React, { useState, useRef } from 'react'
import { Check } from 'lucide-react'
import {
  LanguageIcon,
  CultureIcon,
  CharacterIcon,
  FaithIcon
} from '@/components/ui/dimensional-icons'

interface Pillar {
  id: string
  title: string
  shortLabel: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  summary: string
  details: string[]
  takeaway: string
}

const PILLARS: Pillar[] = [
  {
    id: 'language',
    title: 'Filipino Language',
    shortLabel: 'Language',
    icon: LanguageIcon,
    summary: 'Conversational Tagalog, everyday vocabulary, respectful expressions, and practical oral communication.',
    details: [
      'Everyday conversational phrases and family greetings',
      'Respectful expressions including po and opo',
      'Contextual vocabulary rooted in island geography and daily life',
      'Pronunciation guidance and natural oral dialogue'
    ],
    takeaway: 'Children build confidence speaking natural Tagalog at home with family.'
  },
  {
    id: 'culture',
    title: 'Culture and Heritage',
    shortLabel: 'Culture',
    icon: CultureIcon,
    summary: 'Philippine island geography, regional traditions, historical landmarks, music, and community customs.',
    details: [
      'Exploration of Luzon, Visayas, and Mindanao island regions',
      'Historical landmarks, archival maps, and regional geography',
      'Traditional folk songs, lullabies, and cultural instruments',
      'Community customs and regional celebrations across provinces'
    ],
    takeaway: 'Learners can explore Filipino heritage, regional traditions, and meaningful cultural connections.'
  },
  {
    id: 'character',
    title: 'Values and Character',
    shortLabel: 'Character',
    icon: CharacterIcon,
    summary: 'Timeless Filipino virtues including bayanihan, paggalang, pakikipagkapwa, and honesty.',
    details: [
      'Bayanihan: Cultivating mutual help and community spirit',
      'Paggalang: Honoring elders, family members, and teachers',
      'Pakikipagkapwa: Recognizing shared humanity and empathy',
      'Katapatan: Personal integrity, diligence, and truthful speech'
    ],
    takeaway: 'Character virtues are nurtured through practical, daily family exercises.'
  },
  {
    id: 'faith',
    title: 'Bible-Based Lessons',
    shortLabel: 'Faith',
    icon: FaithIcon,
    summary: 'Foundations in God\'s love, moral discernment, prayerful gratitude, Scripture memory, and Christian virtue.',
    details: [
      'Scripture verses woven thoughtfully into weekly thematic lessons',
      'Morning gratitude and prayerful reflections for quiet starts',
      'Moral discernment based on Biblical wisdom and grace',
      'Loving God and serving others in home and neighborhood'
    ],
    takeaway: 'A warm, Christ-centered foundation supporting parents as primary guides.'
  }
]

export default function LearningFocusTabs() {
  const [activeTab, setActiveTab] = useState<string>('language')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activePillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0]
  const ActiveIcon = activePillar.icon

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let targetIndex: number

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        targetIndex = (index + 1) % PILLARS.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        targetIndex = (index - 1 + PILLARS.length) % PILLARS.length
        break
      case 'Home':
        e.preventDefault()
        targetIndex = 0
        break
      case 'End':
        e.preventDefault()
        targetIndex = PILLARS.length - 1
        break
      default:
        return
    }

    const nextTab = PILLARS[targetIndex]
    setActiveTab(nextTab.id)
    tabRefs.current[targetIndex]?.focus()
  }

  return (
    <div className="w-full max-w-4xl 2xl:max-w-5xl mx-auto">
      {/* Tablist / Segmented Control */}
      <div
        role="tablist"
        aria-label="Learning Focus Pillars"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm"
      >
        {PILLARS.map((pillar, index) => {
          const isSelected = activeTab === pillar.id
          const Icon = pillar.icon

          return (
            <button
              key={pillar.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              role="tab"
              id={`tab-${pillar.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${pillar.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(pillar.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex items-center justify-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-display font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep ${
                isSelected
                  ? 'bg-white text-ocean-deep shadow-md translate-y-0'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{pillar.shortLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Tabpanel Display */}
      {PILLARS.map((pillar) => {
        const isSelected = activeTab === pillar.id
        if (!isSelected) return null

        return (
          <div
            key={pillar.id}
            role="tabpanel"
            id={`panel-${pillar.id}`}
            aria-labelledby={`tab-${pillar.id}`}
            tabIndex={0}
            className="mt-6 p-4 sm:p-8 2xl:p-10 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mango transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/15">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center shadow-inner shrink-0">
                  <ActiveIcon size={36} className="shrink-0" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-mango">
                    Focus Pillar
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl text-white font-bold">
                    {pillar.title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-white/90 leading-relaxed font-medium">
              {pillar.summary}
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
              {pillar.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Check className="w-4 h-4 text-mango mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-xs sm:text-sm text-white/85 leading-snug">
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-white/75 italic">
              <span className="font-bold not-italic text-mango">Family Takeaway:</span>
              <span>{pillar.takeaway}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
