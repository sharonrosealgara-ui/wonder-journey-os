import { createClient } from "@/lib/supabase/client";

export type UploadState = "Preparing" | "Uploading" | "Saving" | "Saved" | "Failed";

export type MediaUploadParams = {
  workspaceId: string;
  familyId?: string;
  relatedEntityType: string;
  relatedEntityId?: string;
  file: File | Blob;
  filename: string;
  caption?: string;
  onProgress?: (state: UploadState, error?: string) => void;
};

export async function uploadFamilyMedia(params: MediaUploadParams): Promise<{ url: string | null; error: string | null }> {
  const { workspaceId, familyId, relatedEntityType, relatedEntityId, file, filename, caption, onProgress } = params;
  const supabase = createClient();
  
  onProgress?.("Uploading");

  // 1. Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    onProgress?.("Failed", "Authentication required");
    return { url: null, error: "Authentication required" };
  }

  // Generate unique storage path: workspaceId/uuid.ext
  const ext = filename.split('.').pop() || 'jpg';
  const uniqueId = crypto.randomUUID();
  const storagePath = `${workspaceId}/${uniqueId}.${ext}`;

  // 2. Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from("family-media")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Storage upload failed", uploadError);
    onProgress?.("Failed", uploadError.message);
    return { url: null, error: uploadError.message };
  }

  onProgress?.("Saving");

  // 3. Insert Database Record
  const { error: dbError } = await supabase
    .from("family_media")
    .insert({
      workspace_id: workspaceId,
      family_id: familyId,
      uploaded_by_user_id: user.id,
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId,
      storage_bucket: "family-media",
      storage_path: storagePath,
      original_filename: filename,
      mime_type: file.type || "application/octet-stream",
      file_size: file.size,
      caption: caption,
    });

  if (dbError) {
    console.error("Database insert failed, cleaning up orphaned file", dbError);
    // Cleanup orphaned file
    await supabase.storage.from("family-media").remove([storagePath]);
    onProgress?.("Failed", "Failed to save record to database");
    return { url: null, error: dbError.message };
  }

  onProgress?.("Saved");

  // 4. Return signed URL for immediate display
  const { data: urlData, error: urlError } = await supabase.storage
    .from("family-media")
    .createSignedUrl(storagePath, 60 * 60 * 24); // 24 hours

  return { url: urlData?.signedUrl || null, error: urlError?.message || null };
}

// Helper to fetch media for a specific entity (e.g. journal entry)
export async function getEntityMedia(workspaceId: string, entityType: string, entityId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("family_media")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("related_entity_type", entityType)
    .eq("related_entity_id", entityId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Generate signed URLs for each
  const withUrls = await Promise.all(
    data.map(async (media) => {
      const { data: urlData } = await supabase.storage
        .from(media.storage_bucket)
        .createSignedUrl(media.storage_path, 60 * 60 * 24);
      return { ...media, signedUrl: urlData?.signedUrl || null };
    })
  );

  return withUrls;
}
