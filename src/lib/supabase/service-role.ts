// Server-only Supabase service-role client for privileged operations.
// NEVER import this from client-side or browser-bundled code.
// Used exclusively for atomic nonce consumption where RLS blocks anon/authenticated clients.

if (typeof window !== "undefined") {
  throw new Error("service-role client cannot be imported in browser context");
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

let _serviceClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createServiceRoleClient() {
  if (_serviceClient) return _serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for service-role operations"
    );
  }

  _serviceClient = createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return _serviceClient;
}
