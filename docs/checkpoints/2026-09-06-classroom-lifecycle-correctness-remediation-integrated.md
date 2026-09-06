# Checkpoint: Classroom Lifecycle Correctness Remediation Integrated

**Date:** 2026-09-06  
**Type:** Core Correctness Remediation (Database Invariants & Read Idempotency)  
**Status:** IMPLEMENTED, VERIFIED & MERGED TO MAIN  

---

## Summary

Remediated two proven architectural and correctness defects discovered post-integration in Candidate #1 (Teacher Classroom Session Lifecycle Management):

1. **Defect 1: Concurrent Classroom Starts Could Create Multiple Active Sessions:**
   - Pre-remediation behavior: `startClassroomSession` performed separate `SELECT` and `INSERT` calls via stateless PostgREST HTTP queries without a database-level lock or unique constraint.
   - Solution: Added Migration `0008_classroom_correctness_invariants.sql` introducing a PostgreSQL partial unique index:
     ```sql
     CREATE UNIQUE INDEX idx_classroom_sessions_one_active_per_workspace
         ON public.classroom_sessions (workspace_id)
         WHERE status = 'active';
     ```
   - Application race handling: When `startClassroomSession` encounters a concurrent insert collision (PostgreSQL error code `23505`), it safely resolves and re-enters the canonical active session created by the winning request.

2. **Defect 2: GET /api/classroom/active-session Created False Attendance Evidence:**
   - Pre-remediation behavior: `GET /api/classroom/active-session` automatically inserted a row into `classroom_participants` with `joined_at = now()` whenever an active session was discovered via passive lobby polling (every 5 seconds), recording false attendance before explicit user entry.
   - Solution: Made `GET /api/classroom/active-session` strictly read-only (zero database mutations). Moved participant creation to the explicit classroom entry boundary in `POST /api/livekit-token`, which is invoked only when the user deliberately clicks **"Enter Classroom"**.
   - Database Invariant for Participant Uniqueness: Migration 0008 also enforces atomic participant uniqueness per session for authenticated users:
     ```sql
     CREATE UNIQUE INDEX idx_classroom_participants_session_user
         ON public.classroom_participants (session_id, user_id)
         WHERE user_id IS NOT NULL;
     ```
   - Joined At Truth: `joined_at` is stamped exclusively on the first successful explicit join. Repeated token requests, refreshes, or re-entries read the existing row without overwriting `joined_at`.

---

## Proven Invariants

1. **At Most One Active Session Per Workspace:** PostgreSQL atomically rejects duplicate active session rows with error `23505`.
2. **Concurrent Start Loser Re-Entry:** A concurrent launch request that loses the insert race resolves the winner's canonical active session without creating duplicate rooms.
3. **Read Idempotency:** `GET /api/classroom/active-session` performs zero inserts, updates, or deletes. Polling every 5 seconds is completely side-effect free.
4. **Explicit Join Boundary:** Participant records and `joined_at` timestamps are created strictly when the user clicks "Enter Classroom" and requests a LiveKit token.
5. **No joined_at Overwrite:** Repeated token requests or page refreshes preserve the original `joined_at` timestamp.
6. **Concurrent Join Race Handling:** Concurrent token requests from the same user handle Postgres `23505` on `idx_classroom_participants_session_user` by resolving the existing participant row.
7. **Zero Data Cleanup / Zero Backfill:** Historical session and participant rows were not rewritten or mutated.
8. **Local Database & CI Only:** Migration 0008 applied cleanly on local/ephemeral Supabase stack. Hosted Supabase was untouched.
9. **All 30 Release Gates Green:** Passed CI run 34011728405 in 4m5s.

---

## Git Provenance

- **Product Commit:** `4265f2ea70da8ca6f9a9ba46d84f85e493393b6e`
- **Parent Commit:** `34b3b59a5eda4ea7c11772c3af82e0dbfefab0ab`
- **Tree:** `2b221df8c6fc581e7d9d132e25ad0a3fd8bbf3d4`
- **Pull Request:** #10 (Merged into `main` via strict fast-forward)
- **CI Run:** 34011728405 (All 30 release gates passed green)
