'use server'

import { createClient } from '@/lib/supabase/server'
import { getLesson, getTodaysLesson } from '@/config/lessons'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type StartSessionResult =
  | {
      success: true;
      sessionId: string;
      lessonId: string;
      roomName: string;
      reentered: boolean;
    }
  | {
      success: false;
      error: string;
    };

export type ConcludeSessionResult =
  | {
      success: true;
      sessionId: string;
      status: "completed";
      endedAt: string;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Starts a live classroom session for the authenticated teacher's workspace.
 * If an active session already exists for this workspace, safely resolves and re-enters it.
 */
export async function startClassroomSession(lessonId?: string): Promise<StartSessionResult> {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: Please sign in to continue." };
  }

  // 2. Verify active teacher/owner/admin workspace membership
  const { data: membership, error: memberError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .single();

  if (memberError || !membership?.workspace_id) {
    return { success: false, error: "Forbidden: No active workspace membership found." };
  }

  const authorizedRoles = ["teacher", "owner", "admin"];
  if (!authorizedRoles.includes(membership.role)) {
    return { success: false, error: "Forbidden: Only teachers may start a classroom session." };
  }

  const workspaceId = membership.workspace_id;
  if (!UUID_RE.test(workspaceId)) {
    return { success: false, error: "Internal error: Invalid workspace identifier." };
  }

  // 3. Validate selected lesson against canonical curriculum truth
  const targetLessonId = lessonId || getTodaysLesson().id;
  const canonicalLesson = getLesson(targetLessonId);
  if (!canonicalLesson) {
    return { success: false, error: `Invalid lesson: "${targetLessonId}" is not part of the curriculum.` };
  }

  // 4. Collision Rule: Check if an active session already exists for this workspace
  const { data: existingSession } = await supabase
    .from("classroom_sessions")
    .select("id, room_name, lesson_id, status")
    .eq("workspace_id", workspaceId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSession) {
    // Ensure teacher has a valid participant record for this existing session
    const { data: teacherPart } = await supabase
      .from("classroom_participants")
      .select("id, role, permission_level")
      .eq("session_id", existingSession.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!teacherPart) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      await supabase.from("classroom_participants").insert({
        session_id: existingSession.id,
        workspace_id: workspaceId,
        user_id: user.id,
        display_name: profile?.display_name || "Teacher",
        role: "teacher",
        permission_level: "full_interactive",
        is_online: true,
      });
    }

    return {
      success: true,
      sessionId: existingSession.id,
      lessonId: existingSession.lesson_id,
      roomName: existingSession.room_name,
      reentered: true,
    };
  }

  // 5. Create new canonical classroom session server-side
  // Room name is derived strictly server-side: wj-{workspaceIdPrefix}-{timestamp}
  const cleanPrefix = workspaceId.replace(/-/g, "").slice(0, 8);
  const roomName = `wj-${cleanPrefix}-${Date.now()}`;

  const { data: newSession, error: sessErr } = await supabase
    .from("classroom_sessions")
    .insert({
      workspace_id: workspaceId,
      room_name: roomName,
      lesson_id: canonicalLesson.id,
      teacher_user_id: user.id,
      status: "active",
      slide_index: 0,
      is_locked: false,
    })
    .select("id, room_name, lesson_id, status")
    .single();

  if (sessErr || !newSession) {
    return { success: false, error: sessErr?.message || "Failed to create classroom session." };
  }

  // 6. Register teacher as authorized participant
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const { error: partErr } = await supabase.from("classroom_participants").insert({
    session_id: newSession.id,
    workspace_id: workspaceId,
    user_id: user.id,
    display_name: profile?.display_name || "Teacher",
    role: "teacher",
    permission_level: "full_interactive",
    is_online: true,
  });

  if (partErr) {
    // If participant insertion fails, clean up session to prevent orphaned state
    await supabase.from("classroom_sessions").delete().eq("id", newSession.id);
    return { success: false, error: "Failed to initialize teacher participant record." };
  }

  return {
    success: true,
    sessionId: newSession.id,
    lessonId: newSession.lesson_id,
    roomName: newSession.room_name,
    reentered: false,
  };
}

/**
 * Concludes an active classroom session for the authorized teacher's workspace.
 * Sets status to 'completed' and records ended_at timestamp.
 */
export async function concludeClassroomSession(sessionId: string): Promise<ConcludeSessionResult> {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized: Please sign in to continue." };
  }

  // 2. Validate sessionId as UUID
  if (!sessionId || !UUID_RE.test(sessionId)) {
    return { success: false, error: "Bad Request: Invalid session identifier." };
  }

  // 3. Verify active teacher/owner/admin workspace membership
  const { data: membership, error: memberError } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .single();

  if (memberError || !membership?.workspace_id) {
    return { success: false, error: "Forbidden: No active workspace membership found." };
  }

  const authorizedRoles = ["teacher", "owner", "admin"];
  if (!authorizedRoles.includes(membership.role)) {
    return { success: false, error: "Forbidden: Only teachers may conclude a classroom session." };
  }

  const workspaceId = membership.workspace_id;

  // 4. Query active session belonging to this workspace
  const { data: sessionData, error: sessErr } = await supabase
    .from("classroom_sessions")
    .select("id, status, workspace_id")
    .eq("id", sessionId)
    .eq("workspace_id", workspaceId)
    .single();

  if (sessErr || !sessionData) {
    return { success: false, error: "Classroom session not found in your workspace." };
  }

  if (sessionData.status !== "active") {
    return { success: false, error: `Session is already ${sessionData.status}.` };
  }

  // 5. Update session to canonical 'completed' status with ended_at
  const now = new Date().toISOString();
  const { data: updatedSession, error: updateErr } = await supabase
    .from("classroom_sessions")
    .update({
      status: "completed",
      ended_at: now,
      updated_at: now,
    })
    .eq("id", sessionId)
    .eq("workspace_id", workspaceId)
    .select("id, status, ended_at")
    .single();

  if (updateErr || !updatedSession) {
    return { success: false, error: updateErr?.message || "Failed to conclude classroom session." };
  }

  // 6. Update participant records for this session
  await supabase
    .from("classroom_participants")
    .update({
      is_online: false,
      last_seen_at: now,
    })
    .eq("session_id", sessionId)
    .eq("user_id", user.id);

  return {
    success: true,
    sessionId: updatedSession.id,
    status: "completed",
    endedAt: now,
  };
}
