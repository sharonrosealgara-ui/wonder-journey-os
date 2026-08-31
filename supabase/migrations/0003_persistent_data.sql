-- 0003_persistent_data.sql
-- Migration to replace localStorage data with Supabase durable tables

-------------------------------------------------------------------------------
-- 1. FAMILY MEDIA
-- Replaces Base64 encoded photos inside localStorage
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.family_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    family_id UUID,
    uploaded_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    related_entity_type TEXT NOT NULL, -- e.g. 'journal_entry', 'cookbook', 'lesson', 'general'
    related_entity_id TEXT,
    storage_bucket TEXT NOT NULL DEFAULT 'family-media',
    storage_path TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT NOT NULL,
    file_size BIGINT,
    caption TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-------------------------------------------------------------------------------
-- 2. JOURNAL ENTRIES
-------------------------------------------------------------------------------
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
ALTER TABLE public.gratitude_entries ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
ALTER TABLE public.awards ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL, -- Logical ID of the child/member
    date DATE NOT NULL,
    title TEXT,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------------------------------
-- 3. GRATITUDE / MORNING BLESSINGS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gratitude_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    date DATE NOT NULL,
    prompt TEXT,
    text TEXT,
    prayer TEXT,
    kindness TEXT,
    hearts INTEGER DEFAULT 0,
    teacher_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------------------------------
-- 4. LESSON PROGRESS / COMPLETIONS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------------------------------
-- 5. AWARDS AND XP
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    badge_id TEXT NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.student_xp (
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (workspace_id, student_id)
);

-------------------------------------------------------------------------------
-- 6. COOKBOOK MEMORIES
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cookbook_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    recipe_id TEXT NOT NULL,
    date DATE NOT NULL,
    cook_names TEXT,
    memory TEXT,
    reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------------------------------
-- 7. VOICE GIFTS
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.voice_gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    from_id TEXT NOT NULL,
    from_name TEXT,
    from_emoji TEXT,
    celebration_id TEXT NOT NULL,
    celebrant_name TEXT,
    date DATE NOT NULL,
    duration INTEGER,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_family_media_workspace_entity ON public.family_media(workspace_id, related_entity_type, related_entity_id);
CREATE INDEX IF NOT EXISTS idx_journal_workspace_date ON public.journal_entries(workspace_id, date);
CREATE INDEX IF NOT EXISTS idx_gratitude_workspace_date ON public.gratitude_entries(workspace_id, date);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_workspace_student ON public.lesson_progress(workspace_id, student_id);

-------------------------------------------------------------------------------
-- RLS POLICIES
-------------------------------------------------------------------------------
-- Enforce Row Level Security
ALTER TABLE public.family_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_gifts ENABLE ROW LEVEL SECURITY;

-- Family Media RLS
CREATE POLICY "Users can view media in their workspace"
    ON public.family_media FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = family_media.workspace_id
            AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert media in their workspace"
    ON public.family_media FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspace_members wm
            WHERE wm.workspace_id = family_media.workspace_id
            AND wm.user_id = auth.uid()
        )
        AND uploaded_by_user_id = auth.uid()
    );

-- Journal Entries RLS
CREATE POLICY "Users can view journals in their workspace"
    ON public.journal_entries FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = journal_entries.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert journals in their workspace"
    ON public.journal_entries FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = journal_entries.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can update journals in their workspace"
    ON public.journal_entries FOR UPDATE USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = journal_entries.workspace_id AND wm.user_id = auth.uid()));

-- Gratitude Entries RLS
CREATE POLICY "Users can view gratitude in their workspace"
    ON public.gratitude_entries FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = gratitude_entries.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert gratitude in their workspace"
    ON public.gratitude_entries FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = gratitude_entries.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can update gratitude in their workspace"
    ON public.gratitude_entries FOR UPDATE USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = gratitude_entries.workspace_id AND wm.user_id = auth.uid()));

-- Lesson Progress RLS
CREATE POLICY "Users can view progress in their workspace"
    ON public.lesson_progress FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = lesson_progress.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert progress in their workspace"
    ON public.lesson_progress FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = lesson_progress.workspace_id AND wm.user_id = auth.uid()));

-- Awards & XP RLS
CREATE POLICY "Users can view awards in their workspace"
    ON public.awards FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = awards.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert awards in their workspace"
    ON public.awards FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = awards.workspace_id AND wm.user_id = auth.uid()));

CREATE POLICY "Users can view xp in their workspace"
    ON public.student_xp FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = student_xp.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert/update xp in their workspace"
    ON public.student_xp FOR ALL USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = student_xp.workspace_id AND wm.user_id = auth.uid()));

-- Cookbook Entries RLS
CREATE POLICY "Users can view cookbook in their workspace"
    ON public.cookbook_entries FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = cookbook_entries.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert cookbook in their workspace"
    ON public.cookbook_entries FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = cookbook_entries.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can update cookbook in their workspace"
    ON public.cookbook_entries FOR UPDATE USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = cookbook_entries.workspace_id AND wm.user_id = auth.uid()));

-- Voice Gifts RLS
CREATE POLICY "Users can view voice gifts in their workspace"
    ON public.voice_gifts FOR SELECT USING (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = voice_gifts.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "Users can insert voice gifts in their workspace"
    ON public.voice_gifts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.workspace_members wm WHERE wm.workspace_id = voice_gifts.workspace_id AND wm.user_id = auth.uid()));

-------------------------------------------------------------------------------
-- REALTIME
-------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_xp;
ALTER PUBLICATION supabase_realtime ADD TABLE public.family_media;
