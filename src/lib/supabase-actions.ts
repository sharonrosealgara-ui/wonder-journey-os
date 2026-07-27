'use server'
import { createClient } from './supabase/server'

export async function pushToSupabaseAction(data: Record<string, any>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  const { data: profile } = await supabase.from('profiles').select('family_id').eq('id', user.id).single()
  const family_id = profile?.family_id
  if (!family_id) return { success: false }

  const syncTable = async (tableName: string, localArray: any[], onConflict: string) => {
    if (!localArray || !Array.isArray(localArray) || localArray.length === 0) return
    const records = localArray.map(item => ({ ...item, family_id }))
    await supabase.from(tableName).upsert(records, { onConflict })
  }

  try {
    if (data.completions) await syncTable('completions', data.completions, 'family_id, lesson_id, student_id')
    if (data.awards) await syncTable('awards', data.awards, 'id')
    if (data.gratitude) await syncTable('gratitude_entries', data.gratitude, 'id')
    if (data.journal) await syncTable('journal_entries', data.journal, 'id')
    if (data.cookbook) await syncTable('cookbook_memories', data.cookbook, 'id')
    if (data.memories) await syncTable('adventure_memories', data.memories, 'id')
    return { success: true }
  } catch (e) {
    console.error('Supabase Sync Error:', e)
    return { success: false }
  }
}

export async function pullFromSupabaseAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, data: null }

  const { data: profile } = await supabase.from('profiles').select('family_id').eq('id', user.id).single()
  const family_id = profile?.family_id
  if (!family_id) return { success: false, data: null }

  const fetchTable = async (tableName: string) => {
    const { data } = await supabase.from(tableName).select('*').eq('family_id', family_id)
    return data || []
  }

  try {
    const data = {
      completions: await fetchTable('completions'),
      awards: await fetchTable('awards'),
      gratitude: await fetchTable('gratitude_entries'),
      journal: await fetchTable('journal_entries'),
      cookbook: await fetchTable('cookbook_memories'),
      memories: await fetchTable('adventure_memories'),
    }
    return { success: true, data }
  } catch (e) {
    console.error('Supabase Pull Error:', e)
    return { success: false, data: null }
  }
}
