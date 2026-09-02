# ⚠️ ARCHIVED / DO NOT DEPLOY: Cloudflare Pages Setup

> [!CAUTION]
> **DO NOT DEPLOY TO CLOUDFLARE PAGES / WORKERS**
> As established in Decision 044, **Hostinger Managed Next.js** is the sole approved application runtime for Wonder Journey OS.
> Cloudflare Pages runtime and associated edge functions (`functions/`) have been deprecated and permanently removed from this codebase.
>
> All backend API routes and authentication mechanisms now execute natively on Next.js with Supabase Authentication and official LiveKit server integration.

---

## Historical Context

This document is preserved for historical architecture records only.
Legacy iterations explored Cloudflare Pages static export with Workers KV bindings. This model was superseded due to:
1. Dynamic server-side rendering (SSR) and Server Components requirements in Next.js 15.
2. Direct integration with Supabase Row-Level Security (RLS) and real session cookies.
3. Centralized Node.js runtime environment on Hostinger Managed Next.js.
