"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AuthRole = "teacher" | "family";

type Profile = {
  id: string;
  role: AuthRole;
  display_name: string;
  family_id: string | null;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AuthRole | null;
  activeWorkspaceId: string | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AuthRole | null>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadAuth() {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (!s?.user) {
          setLoading(false);
          return;
        }
        setSession(s);
        setUser(s.user);

        // Fetch profile with role
        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("id, role, display_name, family_id")
          .eq("id", s.user.id)
          .single();

        if (profileErr || !profileData) {
          setError("Account not configured. Please contact your administrator.");
          setLoading(false);
          return;
        }

        // Validate role
        if (profileData.role !== "teacher" && profileData.role !== "family") {
          setError("Account has an invalid role configuration.");
          setLoading(false);
          return;
        }

        setProfile(profileData as Profile);
        setRole(profileData.role as AuthRole);

        // Fetch workspace membership
        const { data: memberships } = await supabase
          .from("workspace_members")
          .select("workspace_id, role")
          .eq("user_id", s.user.id)
          .eq("status", "active")
          .limit(1);

        if (memberships && memberships.length > 0) {
          // Validate workspace role matches profile role
          const membership = memberships[0];
          if (membership.role !== profileData.role) {
            setError("Account role conflict detected. Please contact your administrator.");
            setLoading(false);
            return;
          }
          setActiveWorkspaceId(membership.workspace_id);
        }
        // Note: missing workspace membership is not fatal for MVP
        // (workspace tables may not be seeded yet)
      } catch {
        setError("Failed to load account information.");
      } finally {
        setLoading(false);
      }
    }

    loadAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole(null);
          setActiveWorkspaceId(null);
          setError(null);
        }
        if (event === "SIGNED_IN") {
          // Reload to pick up new session
          loadAuth();
        }
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    // Clear any legacy localStorage auth keys
    if (typeof window !== "undefined") {
      const legacyKeys = ["wjos:classCode", "wjos:mode", "wjos:guest", "wjos:displayName", "wjos:codePromptDismissed"];
      legacyKeys.forEach((k) => {
        try { window.localStorage.removeItem(k); } catch { /* ignore */ }
      });
    }
    router.push("/login");
  }, [supabase, router]);

  return (
    <AuthCtx.Provider value={{ session, user, profile, role, activeWorkspaceId, loading, error, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
