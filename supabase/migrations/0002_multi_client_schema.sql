-- Multi-Client Architecture & Public Inquiries

-- 1. Create workspaces table
CREATE TABLE public.workspaces (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    workspace_type text NOT NULL,
    logo_url text,
    primary_color text,
    secondary_color text,
    languages text[],
    religious_settings text,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create workspace_members table
CREATE TABLE public.workspace_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, user_id)
);

-- 3. Modify families table to link to workspaces
ALTER TABLE public.families 
ADD COLUMN workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
ADD COLUMN timezone text,
ADD COLUMN preferences jsonb,
ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- (Optional for MVP: seed the initial Ferrell Family workspace)

-- 4. Create the inquiries table for public leads
CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    whatsapp_number text,
    country text,
    interested_service text NOT NULL,
    client_type text NOT NULL,
    learner_ages text,
    requested_subjects text,
    preferred_schedule text,
    platform_needs text,
    estimated_start text,
    message text,
    consent_given boolean NOT NULL DEFAULT false,
    
    -- Internal tracking
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'discovery_scheduled', 'proposal_sent', 'converted', 'closed', 'archived')),
    assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    internal_notes text,
    follow_up_at date,
    preferred_contact_method text,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    archived_at timestamp with time zone
);

-- 5. Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Utility function to check membership
CREATE OR REPLACE FUNCTION auth.is_workspace_member(check_workspace_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE user_id = auth.uid() 
    AND workspace_id = check_workspace_id
    AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS for Workspaces
CREATE POLICY "Users can read workspaces they belong to" ON public.workspaces
    FOR SELECT USING (
        auth.is_workspace_member(id)
    );

-- RLS for Workspace Members
CREATE POLICY "Users can read members of their workspace" ON public.workspace_members
    FOR SELECT USING (
        auth.is_workspace_member(workspace_id)
    );

-- RLS for Inquiries
CREATE POLICY "Public can submit inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- (Requires `auth.is_teacher()` which we defined in 0001)
CREATE POLICY "Teachers can view inquiries" ON public.inquiries
    FOR SELECT USING (auth.is_teacher());

CREATE POLICY "Teachers can update inquiries" ON public.inquiries
    FOR UPDATE USING (auth.is_teacher());
