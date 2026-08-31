-- 0006_game_evaluation_nonces.sql
-- Stage 12.1R.10: Database-Enforced Atomic Replay Protection for Server Game Evaluations
-- Server-only service-role insertion — zero client access

CREATE TABLE IF NOT EXISTS public.game_evaluation_nonces (
    nonce TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    consumed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_game_nonces_user ON public.game_evaluation_nonces(user_id);
CREATE INDEX IF NOT EXISTS idx_game_nonces_session ON public.game_evaluation_nonces(session_id);
CREATE INDEX IF NOT EXISTS idx_game_nonces_expires ON public.game_evaluation_nonces(expires_at);

ALTER TABLE public.game_evaluation_nonces ENABLE ROW LEVEL SECURITY;

-- Zero access for anon and authenticated clients.
-- No INSERT, UPDATE, SELECT, or DELETE policies are created.
-- All nonce operations use the server-side service-role client which bypasses RLS.

-- Explicitly revoke any direct table access from anon and authenticated roles
REVOKE ALL ON public.game_evaluation_nonces FROM anon;
REVOKE ALL ON public.game_evaluation_nonces FROM authenticated;
