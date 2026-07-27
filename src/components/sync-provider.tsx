"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStudentXP, getJournalEntries, getGratitudeEntries, getCompletions } from "@/lib/api/data";
import { KEYS } from "@/lib/app-state";
import { writeStored } from "@/lib/storage";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [synced, setSynced] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function hydrate() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Resolve workspace membership (for now, assume we have a workspace_id stored or default)
        // In a real multi-tenant app, this comes from workspace_members.
        // For the Ferrell family, we'll fetch the first available workspace.
        const { data: workspaces } = await supabase
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", session.user.id)
          .limit(1);

        if (workspaces && workspaces.length > 0) {
          const workspaceId = workspaces[0].workspace_id;
          
          // Hydrate XP
          const { data: xpData } = await supabase.from("student_xp").select("student_id, amount").eq("workspace_id", workspaceId);
          if (xpData) {
            const xpMap: Record<string, number> = {};
            xpData.forEach(x => xpMap[x.student_id] = x.amount);
            writeStored(KEYS.xp, xpMap);
          }

          // Hydrate Journals
          const journals = await getJournalEntries(workspaceId);
          if (journals.length > 0) writeStored(KEYS.journal, journals);

          // Hydrate Gratitude
          const gratitude = await getGratitudeEntries(workspaceId);
          if (gratitude.length > 0) writeStored(KEYS.gratitude, gratitude);

          // Hydrate Completions
          const completions = await getCompletions(workspaceId);
          if (completions.length > 0) writeStored(KEYS.completions, completions);
        }
      }
      setSynced(true);
    }
    
    hydrate();
  }, [supabase]);

  if (!synced) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-paper text-ink-soft">
        <div className="text-4xl animate-pulse">🧭</div>
        <p className="mt-4 font-hand text-lg">Syncing your journey...</p>
      </div>
    );
  }

  return <>{children}</>;
}
