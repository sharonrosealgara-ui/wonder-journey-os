# ⚠️ DEFERRED: Make.com Integration & Webhooks

> [!NOTE]
> **INTEGRATION STATUS: DEFERRED**
> Third-party Make.com webhook dispatching and unauthenticated `/api/events` polling have been deferred.
> Direct external webhook delivery will be implemented via authenticated server-side background queues and Supabase webhooks once an authenticated server-side integration pipeline is configured.
>
> Unauthenticated client event emission (`sendEvent`) and legacy Netlify Blobs storage have been completely removed from the application core.

---

## Architectural Direction for Future Integration

When external automation hooks are reintroduced:
1. **Server-Side Triggering:** Webhooks will be dispatched from authenticated Next.js Server Actions or Supabase Database Triggers, never directly from client browsers.
2. **Authenticated Delivery:** Webhook payloads will be signed using HMAC SHA-256 signatures with secret keys stored securely in Hostinger environment variables.
3. **Zero PII & Spiritual Content Isolation:** Prayer journals, family reflections, and child voice recordings remain strictly confidential and isolated within Supabase RLS policies.
