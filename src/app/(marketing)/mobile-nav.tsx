'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, LogIn, Compass } from 'lucide-react'

interface MobileNavProps {
  formEnabled: boolean
}

export default function MobileNav({ formEnabled }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)

  // Handle Escape key and outside clicks
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        toggleButtonRef.current?.focus()
        return
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstEl = focusableElements[0]
        const lastEl = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault()
            lastEl.focus()
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        toggleButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)

    // Lock body scroll while drawer is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus the first interactive element inside drawer
    const timer = setTimeout(() => {
      if (!drawerRef.current) return
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }, 50)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = originalOverflow
      clearTimeout(timer)
    }
  }, [isOpen])

  const closeMenu = () => {
    setIsOpen(false)
    toggleButtonRef.current?.focus()
  }

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        ref={toggleButtonRef}
        id="mobile-nav-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl text-ocean-deep hover:bg-sand/60 border border-sand-deep/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
      </button>

      {/* Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ocean-deep/40 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={closeMenu}
          />

          {/* Drawer Menu */}
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            className="relative w-full max-w-xs bg-paper h-screen shadow-2xl flex flex-col justify-between p-6 overflow-y-auto border-l border-sand-deep/80 z-10"
          >
            <div>
              {/* Top Bar inside Drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-sand-deep/60">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-2 font-display text-lg text-ocean-deep font-bold"
                >
                  <Compass className="w-5 h-5 text-ocean-deep" aria-hidden="true" />
                  <span>Wonder Journey</span>
                </Link>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-ink-soft hover:text-ocean-deep hover:bg-sand/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col space-y-3 font-display text-base font-bold">
                <Link
                  ref={firstLinkRef}
                  href="#experience"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Experience
                </Link>
                <Link
                  href="#gallery"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Curriculum Imagery
                </Link>
                <Link
                  href="#focus"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Learning Focus
                </Link>
                <Link
                  href="#family-space"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Family Space
                </Link>
                <Link
                  href="#faith"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Faith
                </Link>
                <Link
                  href="#founder"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Founder
                </Link>
                <Link
                  href="#inquiry"
                  onClick={closeMenu}
                  className="px-3 py-2.5 rounded-xl text-ink hover:text-ocean-deep hover:bg-sand/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-deep"
                >
                  Inquiry Info
                </Link>
              </nav>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-6 border-t border-sand-deep/60">
              <Link
                href="/login"
                onClick={closeMenu}
                className="wj-btn w-full text-center py-3 flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{formEnabled ? 'Login' : 'Existing Family Login'}</span>
              </Link>
              <p className="text-[11px] text-ink-soft text-center mt-3 font-medium">
                Informational website. Enrollment closed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
