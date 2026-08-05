import { createClient } from "@/lib/supabase/client";
import { JournalEntry, GratitudeEntry, LessonCompletion, AwardedBadge, CookbookMemory } from "@/lib/app-state";

/**
 * 1. XP
 */
export async function getStudentXP(workspaceId: string, studentId: string): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("student_xp")
    .select("amount")
    .eq("workspace_id", workspaceId)
    .eq("student_id", studentId)
    .single();
  if (error || !data) return 0;
  return data.amount;
}

export async function addStudentXP(workspaceId: string, studentId: string, amountToAdd: number): Promise<boolean> {
  const supabase = createClient();
  // Get current XP
  const current = await getStudentXP(workspaceId, studentId);
  const { error } = await supabase
    .from("student_xp")
    .upsert({
      workspace_id: workspaceId,
      student_id: studentId,
      amount: current + amountToAdd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'workspace_id, student_id' });
  return !error;
}

/**
 * 2. JOURNAL ENTRIES
 */
export async function getJournalEntries(workspaceId: string): Promise<JournalEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    studentId: d.student_id,
    date: d.date,
    title: d.title || "",
    text: d.text || ""
  }));
}

export async function saveJournalEntry(workspaceId: string, entry: Omit<JournalEntry, "id"> & { id?: string }): Promise<string | null> {
  const supabase = createClient();
  const payload = {
    workspace_id: workspaceId,
    student_id: entry.studentId,
    date: entry.date,
    title: entry.title,
    text: entry.text,
  };
  
  const query = entry.id 
    ? supabase.from("journal_entries").update(payload).eq("id", entry.id).select("id").single()
    : supabase.from("journal_entries").insert(payload).select("id").single();
    
  const { data, error } = await query;
  if (error || !data) return null;
  return data.id;
}

/**
 * 3. GRATITUDE / BLESSINGS
 */
export async function getGratitudeEntries(workspaceId: string): Promise<GratitudeEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gratitude_entries")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    studentId: d.student_id,
    date: d.date,
    prompt: d.prompt || "",
    text: d.text || "",
    prayer: d.prayer || "",
    kindness: d.kindness || "",
    hearts: d.hearts || 0,
    teacherNote: d.teacher_note || ""
  }));
}

export async function saveGratitudeEntry(workspaceId: string, entry: Omit<GratitudeEntry, "id"> & { id?: string }): Promise<string | null> {
  const supabase = createClient();
  const payload = {
    workspace_id: workspaceId,
    student_id: entry.studentId,
    date: entry.date,
    prompt: entry.prompt,
    text: entry.text,
    prayer: entry.prayer,
    kindness: entry.kindness,
    hearts: entry.hearts,
    teacher_note: entry.teacherNote,
  };
  
  const query = entry.id 
    ? supabase.from("gratitude_entries").update(payload).eq("id", entry.id).select("id").single()
    : supabase.from("gratitude_entries").insert(payload).select("id").single();
    
  const { data, error } = await query;
  if (error || !data) return null;
  return data.id;
}

/**
 * 4. COMPLETIONS
 */
export async function getCompletions(workspaceId: string): Promise<LessonCompletion[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("workspace_id", workspaceId);
  if (error || !data) return [];
  return data.map(d => ({
    lessonId: d.lesson_id,
    studentId: d.student_id,
    date: d.date
  }));
}

export async function saveCompletion(workspaceId: string, completion: LessonCompletion): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("lesson_progress")
    .insert({
      workspace_id: workspaceId,
      student_id: completion.studentId,
      lesson_id: completion.lessonId,
      date: completion.date
    });
  return !error;
}
