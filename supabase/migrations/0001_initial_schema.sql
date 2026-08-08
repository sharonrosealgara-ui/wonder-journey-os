-- Initial Schema for Wonder Journey OS

CREATE TABLE public.families (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    family_id uuid REFERENCES public.families(id) ON DELETE SET NULL,
    role text NOT NULL CHECK (role IN ('teacher', 'family')),
    display_name text NOT NULL,
    active_status text DEFAULT 'active'
);

CREATE TABLE public.family_members (
    id text PRIMARY KEY,
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    name text NOT NULL,
    type text NOT NULL,
    emoji text NOT NULL,
    color text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.completions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    lesson_id text NOT NULL,
    student_id text NOT NULL,
    date text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(family_id, lesson_id, student_id)
);

CREATE TABLE public.awards (
    id text PRIMARY KEY,
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    badge_id text NOT NULL,
    student_id text NOT NULL,
    date text NOT NULL,
    note text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.gratitude_entries (
    id text PRIMARY KEY,
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    student_id text NOT NULL,
    date text NOT NULL,
    prompt text NOT NULL,
    text text NOT NULL,
    prayer text,
    kindness text,
    hearts integer,
    teacher_note text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.journal_entries (
    id text PRIMARY KEY,
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    student_id text NOT NULL,
    date text NOT NULL,
    title text NOT NULL,
    text text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.cookbook_memories (
    id text PRIMARY KEY,
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    recipe_id text NOT NULL,
    date text NOT NULL,
    cook_names text NOT NULL,
    photo text,
    memory text NOT NULL,
    reflection text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.adventure_memories (
    id text PRIMARY KEY,
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    lesson_id text NOT NULL,
    student_id text NOT NULL,
    date text NOT NULL,
    photo text,
    caption text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.whatsapp_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
    type text NOT NULL,
    content text NOT NULL,
    status text NOT NULL CHECK (status IN ('draft', 'sent')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Configuration

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookbook_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adventure_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE SCHEMA IF NOT EXISTS private;

-- Utility function to get current user's family_id
CREATE OR REPLACE FUNCTION private.current_family_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT family_id
  FROM public.profiles
  WHERE id = (SELECT auth.uid())
  LIMIT 1;
$$;

-- Utility function to check if current user is teacher
CREATE OR REPLACE FUNCTION private.is_teacher()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (
      SELECT role = 'teacher'
      FROM public.profiles
      WHERE id = (SELECT auth.uid())
      LIMIT 1
    ),
    false
  );
$$;

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.current_family_id TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_teacher TO authenticated;

-- Policies for families
CREATE POLICY "Families can read their own data or teachers can read assigned" ON public.families
    FOR SELECT TO authenticated USING (
        id = private.current_family_id() OR private.is_teacher()
    );

-- (To simplify MVP, we allow authenticated users with a matching family_id OR teacher role to read/write)

-- Policy Template Function
CREATE OR REPLACE FUNCTION public.create_standard_policies(table_name text) RETURNS void AS $$
BEGIN
    EXECUTE format('
        CREATE POLICY "%1$s_read" ON public.%1$s FOR SELECT TO authenticated USING (family_id = private.current_family_id() OR private.is_teacher());
        CREATE POLICY "%1$s_insert" ON public.%1$s FOR INSERT TO authenticated WITH CHECK (family_id = private.current_family_id() OR private.is_teacher());
        CREATE POLICY "%1$s_update" ON public.%1$s FOR UPDATE TO authenticated USING (family_id = private.current_family_id() OR private.is_teacher());
        CREATE POLICY "%1$s_delete" ON public.%1$s FOR DELETE TO authenticated USING (family_id = private.current_family_id() OR private.is_teacher());
    ', table_name);
END;
$$ LANGUAGE plpgsql;

-- Profiles specific policies
CREATE POLICY "profiles_read" ON public.profiles
    FOR SELECT TO authenticated USING (
        id = auth.uid() OR private.is_teacher()
    );

CREATE POLICY "profiles_insert" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (
        private.is_teacher()
    );

CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE TO authenticated USING (
        id = auth.uid() OR private.is_teacher()
    ) WITH CHECK (
        (id = auth.uid() AND role = 'family' AND family_id = private.current_family_id())
        OR private.is_teacher()
    );

CREATE POLICY "profiles_delete" ON public.profiles
    FOR DELETE TO authenticated USING (
        private.is_teacher()
    );

SELECT public.create_standard_policies('family_members');
SELECT public.create_standard_policies('completions');
SELECT public.create_standard_policies('awards');
SELECT public.create_standard_policies('gratitude_entries');
SELECT public.create_standard_policies('journal_entries');
SELECT public.create_standard_policies('cookbook_memories');
SELECT public.create_standard_policies('adventure_memories');
SELECT public.create_standard_policies('whatsapp_messages');
