'use server'

import { createClient } from '@/lib/supabase/server'

export async function migrateLocalData(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not logged in")

  const { data: profile } = await supabase.from('profiles').select('family_id').eq('id', user.id).single()
  const family_id = profile?.family_id
  if (!family_id) throw new Error("No family profile found")

  // Helper to map and insert
  const syncTable = async (tableName: string, localArray: any[], onConflict: string) => {
    if (!localArray || !Array.isArray(localArray) || localArray.length === 0) return
    const records = localArray.map(item => ({ ...item, family_id }))
    const { error } = await supabase.from(tableName).upsert(records, { onConflict })
    if (error) console.error(`Migration error for ${tableName}:`, error)
  }

  await syncTable('completions', data.completions, 'family_id, lesson_id, student_id')
  await syncTable('awards', data.awards, 'id')
  await syncTable('gratitude_entries', data.gratitude, 'id')
  await syncTable('journal_entries', data.journal, 'id')
  await syncTable('cookbook_memories', data.cookbook, 'id')
  await syncTable('adventure_memories', data.memories, 'id')
  
  return { success: true }
}
