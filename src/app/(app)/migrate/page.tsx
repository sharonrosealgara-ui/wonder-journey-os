"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { exportAllData } from '@/lib/storage'
import { migrateLocalData } from './actions'

export default function MigratePage() {
  const [hasLocalData, setHasLocalData] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  // Determine home route based on authenticated role
  const homeRoute = auth.role === 'teacher' ? '/teacher' : auth.role === 'family' ? '/family' : '/login'

  useEffect(() => {
    if (auth.loading) return
    if (!auth.user) {
      router.replace('/login')
      return
    }

    const isMigrated = localStorage.getItem('wjos:migrated')
    if (isMigrated === 'true') {
      router.replace(homeRoute)
      return
    }

    const data = exportAllData()
    const parsed = JSON.parse(data)
    
    const hasData = Object.entries(parsed.data || {}).some(([key, val]) => {
      if (Array.isArray(val) && val.length > 0) return true
      if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) return true
      if (typeof val === 'string' && val.length > 0 && key !== 'mode') return true
      return false
    })

    if (hasData) {
      setHasLocalData(true)
    } else {
      localStorage.setItem('wjos:migrated', 'true')
      router.replace(homeRoute)
    }
  }, [router, auth.loading, auth.user, homeRoute])

  const handleMigrate = async () => {
    setMigrating(true)
    const data = JSON.parse(exportAllData()).data

    try {
      await migrateLocalData(data)
      localStorage.setItem('wjos:migrated', 'true')
      setDone(true)
      setTimeout(() => router.push(homeRoute), 2000)
    } catch (e) {
      console.error(e)
      alert("Something went wrong during migration.")
      setMigrating(false)
    }
  }

  const handleSkip = () => {
    if (confirm("Are you sure? Your local progress will not be synced to the cloud.")) {
      localStorage.setItem('wjos:migrated', 'true')
      router.push(homeRoute)
    }
  }

  if (auth.loading || !hasLocalData) return null

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-paper">
      <div className="wj-card max-w-md p-8 text-center space-y-6">
        <h1 className="text-4xl font-display text-ocean-deep">Cloud Sync ☁️</h1>
        <p className="text-lg font-hand text-ink-soft">
          We found existing progress on this device! Would you like to save it to your cloud account?
        </p>
        
        {done ? (
          <div className="rounded-xl bg-mango/20 p-4 font-bold text-mango-deep">
            Migration complete! Redirecting...
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={handleMigrate} disabled={migrating} className="wj-btn w-full text-lg">
              {migrating ? 'Syncing securely...' : 'Yes, import my progress'}
            </button>
            <button onClick={handleSkip} disabled={migrating} className="wj-btn wj-btn-ghost w-full">
              No, keep it local-only
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
