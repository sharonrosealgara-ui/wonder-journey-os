-- 0008_classroom_correctness_invariants.sql
-- Classroom Lifecycle Correctness: Enforces atomic workspace active session uniqueness and participant per-session uniqueness

-------------------------------------------------------------------------------
-- 1. AT MOST ONE ACTIVE CLASSROOM SESSION PER WORKSPACE
-- Guarantees at the PostgreSQL database level that concurrent launch attempts
-- cannot create duplicate active sessions for the same workspace.
-------------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_classroom_sessions_one_active_per_workspace
    ON public.classroom_sessions (workspace_id)
    WHERE status = 'active';

-------------------------------------------------------------------------------
-- 2. AT MOST ONE PARTICIPANT PER SESSION PER AUTHENTICATED USER
-- Guarantees at the PostgreSQL database level that concurrent join requests
-- cannot create duplicate participant rows for the same authenticated user.
-------------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_classroom_participants_session_user
    ON public.classroom_participants (session_id, user_id)
    WHERE user_id IS NOT NULL;
