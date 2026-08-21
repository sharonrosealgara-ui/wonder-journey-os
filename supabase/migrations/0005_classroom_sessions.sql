-- 0005_classroom_sessions.sql
-- Stage 12.1: Classroom Sessions, Participant Permissions, Board Snapshots, and Synchronized Interaction State

-------------------------------------------------------------------------------
-- 1. CLASSROOM SESSIONS
-- Tracks active and completed teacher-led live classroom sessions
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classroom_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    room_name TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    teacher_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discarded')),
    slide_index INTEGER NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_classroom_sessions_workspace ON public.classroom_sessions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_room ON public.classroom_sessions(room_name);
CREATE INDEX IF NOT EXISTS idx_classroom_sessions_status ON public.classroom_sessions(status);

ALTER TABLE public.classroom_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view classroom sessions in their workspace"
    ON public.classroom_sessions FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can insert classroom sessions in their workspace"
    ON public.classroom_sessions FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('teacher', 'owner', 'admin')
        )
        AND teacher_user_id = auth.uid()
    );

CREATE POLICY "Teachers can update classroom sessions in their workspace"
    ON public.classroom_sessions FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('teacher', 'owner', 'admin')
        )
    );

-------------------------------------------------------------------------------
-- 2. CLASSROOM PARTICIPANTS
-- Tracks online status and authorized interaction permission levels
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classroom_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id TEXT,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'family', 'student')),
    permission_level TEXT NOT NULL DEFAULT 'view_only' CHECK (permission_level IN ('view_only', 'pointer_only', 'annotate', 'game_interactive', 'full_interactive', 'frozen')),
    is_online BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_classroom_participants_session ON public.classroom_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_classroom_participants_workspace ON public.classroom_participants(workspace_id);

ALTER TABLE public.classroom_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants in their workspace sessions"
    ON public.classroom_participants FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert themselves as participants in their workspace sessions"
    ON public.classroom_participants FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage participant permissions in their workspace sessions"
    ON public.classroom_participants FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('teacher', 'owner', 'admin')
        )
    );

CREATE POLICY "Participants can update their own last_seen_at and online state"
    ON public.classroom_participants FOR UPDATE
    USING (
        user_id = auth.uid()
    );

-------------------------------------------------------------------------------
-- 3. SAVED BOARD SNAPSHOTS
-- Persists teacher-saved whiteboard annotations and drawings
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classroom_board_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    slide_id TEXT NOT NULL,
    slide_index INTEGER NOT NULL,
    saved_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_name TEXT,
    board_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_classroom_snapshots_session ON public.classroom_board_snapshots(session_id);
CREATE INDEX IF NOT EXISTS idx_classroom_snapshots_workspace ON public.classroom_board_snapshots(workspace_id);

ALTER TABLE public.classroom_board_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view board snapshots in their workspace"
    ON public.classroom_board_snapshots FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create board snapshots in their workspace"
    ON public.classroom_board_snapshots FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('teacher', 'owner', 'admin')
        )
        AND saved_by_user_id = auth.uid()
    );

-------------------------------------------------------------------------------
-- 4. CLASSROOM ACTIVITY RESULTS
-- Persists student interactive activity submissions (evaluated server/teacher-side)
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classroom_activity_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    slide_id TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('multiple_choice', 'matching', 'sequencing', 'drawing', 'word_game', 'memory_game', 'scenario')),
    response_data JSONB NOT NULL,
    is_evaluated BOOLEAN NOT NULL DEFAULT false,
    score NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_classroom_activity_session ON public.classroom_activity_results(session_id);
CREATE INDEX IF NOT EXISTS idx_classroom_activity_workspace ON public.classroom_activity_results(workspace_id);

ALTER TABLE public.classroom_activity_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activity results in their workspace"
    ON public.classroom_activity_results FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Students and families can submit activity responses"
    ON public.classroom_activity_results FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can evaluate and update activity results"
    ON public.classroom_activity_results FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('teacher', 'owner', 'admin')
        )
    );
