import { AppShell } from "@/components/app-shell";
import { SyncProvider } from "@/components/sync-provider";
import { AuthProvider } from "@/lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>
        <AppShell>{children}</AppShell>
      </SyncProvider>
    </AuthProvider>
  );
}
