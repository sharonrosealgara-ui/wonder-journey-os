-- 0004_storage_buckets.sql
-- Setting up family-media storage bucket

INSERT INTO storage.buckets (id, name, public)
VALUES ('family-media', 'family-media', false)
ON CONFLICT (id) DO NOTHING;

-- RLS on storage.objects

-- Allow users to upload to their workspace path
CREATE POLICY "Users can upload media to their workspace"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'family-media' 
    AND (storage.foldername(name))[1] IN (
        SELECT workspace_id::text
        FROM public.workspace_members
        WHERE user_id = auth.uid()
    )
);

-- Allow users to view media in their workspace
CREATE POLICY "Users can view media in their workspace"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'family-media' 
    AND (storage.foldername(name))[1] IN (
        SELECT workspace_id::text
        FROM public.workspace_members
        WHERE user_id = auth.uid()
    )
);

-- Allow users to delete media in their workspace
CREATE POLICY "Users can delete media in their workspace"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'family-media' 
    AND (storage.foldername(name))[1] IN (
        SELECT workspace_id::text
        FROM public.workspace_members
        WHERE user_id = auth.uid()
    )
);
