// scripts/seed-local-database.js
// Seeds the real local PostgreSQL/Supabase database with users, workspaces, sessions, and participants.

const { createClient } = require("@supabase/supabase-js");
const { requireE2ECredentials } = require("./e2e-credentials-helper");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || typeof SUPABASE_URL !== "string" || SUPABASE_URL.trim().length === 0) {
  console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL environment variable is required for seeding.");
  process.exit(1);
}

if (!SERVICE_KEY || typeof SERVICE_KEY !== "string" || SERVICE_KEY.trim().length === 0) {
  console.error("FAIL: SUPABASE_SERVICE_ROLE_KEY environment variable is required for seeding.");
  process.exit(1);
}

const { teacherPassword, familyPassword } = requireE2ECredentials();

const SEED_DATA = {
  teacher: {
    id: "e8b1d977-9b2f-4e94-8bf4-6ef26e5a0001",
    email: "teacher@wonderjourney.app",
    password: teacherPassword,
    role: "teacher",
    display_name: "Teacher Sharon",
  },
  family: {
    id: "f8b1d977-9b2f-4e94-8bf4-6ef26e5a0002",
    email: "family@wonderjourney.app",
    password: familyPassword,
    role: "family",
    display_name: "David Del Rosario",
  },
  workspace: {
    id: "a8b1d977-9b2f-4e94-8bf4-6ef26e5a0010",
    name: "Del Rosario Family Workspace",
    slug: "del-rosario",
    workspace_type: "family",
    status: "active",
  },
  otherWorkspace: {
    id: "a8b1d977-9b2f-4e94-8bf4-6ef26e5a0099",
    name: "Other Family Workspace",
    slug: "other-workspace",
    workspace_type: "family",
    status: "active",
  },
  activeSession: {
    id: "c8b1d977-9b2f-4e94-8bf4-6ef26e5a0100",
    workspace_id: "a8b1d977-9b2f-4e94-8bf4-6ef26e5a0010",
    teacher_user_id: "e8b1d977-9b2f-4e94-8bf4-6ef26e5a0001",
    lesson_id: "lesson-1-world-map",
    slide_index: 0,
    room_name: "room-c8b1d977-9b2f-4e94-8bf4-6ef26e5a0100",
    status: "active",
  },
  inactiveSession: {
    id: "c8b1d977-9b2f-4e94-8bf4-6ef26e5a0101",
    workspace_id: "a8b1d977-9b2f-4e94-8bf4-6ef26e5a0010",
    teacher_user_id: "e8b1d977-9b2f-4e94-8bf4-6ef26e5a0001",
    lesson_id: "lesson-1-world-map",
    slide_index: 0,
    room_name: "room-c8b1d977-9b2f-4e94-8bf4-6ef26e5a0101",
    status: "completed",
  },
};

if (typeof global.WebSocket === "undefined") {
  global.WebSocket = class DummyWebSocket {
    constructor() {}
    close() {}
    send() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

async function seedLocalDatabase() {
  console.log(`Seeding database at ${SUPABASE_URL}...`);
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    realtime: {
      createClient: () => ({
        connect: () => {},
        disconnect: () => {},
        channel: () => ({ subscribe: () => {} }),
      }),
    },
  });

  // 1. Create or ensure Auth Users with current ephemeral passwords
  for (const userSpec of [SEED_DATA.teacher, SEED_DATA.family]) {
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to list auth users during seed: ${listError.message}`);
    }

    const existing = userList?.users?.find(u => u.email === userSpec.email || u.id === userSpec.id);
    if (!existing) {
      const { error: createError } = await supabase.auth.admin.createUser({
        id: userSpec.id,
        email: userSpec.email,
        password: userSpec.password,
        email_confirm: true,
        user_metadata: { name: userSpec.display_name },
      });
      if (createError) {
        throw new Error(`Failed to create auth user ${userSpec.email}: ${createError.message}`);
      }
      console.log(`  ✓ Created auth user ${userSpec.email} (${userSpec.id})`);
    } else {
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
        password: userSpec.password,
        email_confirm: true,
        user_metadata: { name: userSpec.display_name },
      });
      if (updateError) {
        throw new Error(`Failed to update password for auth user ${userSpec.email}: ${updateError.message}`);
      }
      console.log(`  ✓ Auth user ${userSpec.email} password synchronized`);
    }
  }

  // 2. Ensure Workspaces
  for (const ws of [SEED_DATA.workspace, SEED_DATA.otherWorkspace]) {
    const { error } = await supabase.from("workspaces").upsert(ws, { onConflict: "id" });
    if (error) throw new Error(`Workspace upsert failed: ${error.message}`);
    console.log(`  ✓ Workspace ${ws.slug} (${ws.id})`);
  }

  // 3. Ensure Families
  const familyRow = {
    id: "e8b1d977-9b2f-4e94-8bf4-6ef26e5a0050",
    name: "Del Rosario Family",
    workspace_id: SEED_DATA.workspace.id,
  };
  const { error: famError } = await supabase.from("families").upsert(familyRow, { onConflict: "id" });
  if (famError) throw new Error(`Families upsert failed: ${famError.message}`);

  // 4. Ensure Profiles
  for (const userSpec of [SEED_DATA.teacher, SEED_DATA.family]) {
    const { error } = await supabase.from("profiles").upsert({
      id: userSpec.id,
      role: userSpec.role,
      display_name: userSpec.display_name,
      family_id: familyRow.id,
    }, { onConflict: "id" });
    if (error) throw new Error(`Profile upsert failed for ${userSpec.email}: ${error.message}`);
    console.log(`  ✓ Profile for ${userSpec.email}`);
  }

  // 5. Ensure Workspace Members
  const memberships = [
    {
      workspace_id: SEED_DATA.workspace.id,
      user_id: SEED_DATA.teacher.id,
      role: "teacher",
      status: "active",
    },
    {
      workspace_id: SEED_DATA.workspace.id,
      user_id: SEED_DATA.family.id,
      role: "family",
      status: "active",
    },
  ];

  for (const m of memberships) {
    const { error } = await supabase.from("workspace_members").upsert(m, { onConflict: "workspace_id,user_id" });
    if (error) throw new Error(`Membership upsert failed for user ${m.user_id}: ${error.message}`);
    console.log(`  ✓ Membership user ${m.user_id} in workspace ${m.workspace_id}`);
  }

  // 6. Ensure Classroom Sessions
  for (const sess of [SEED_DATA.activeSession, SEED_DATA.inactiveSession]) {
    const { error } = await supabase.from("classroom_sessions").upsert(sess, { onConflict: "id" });
    if (error) throw new Error(`Session upsert failed for session ${sess.id}: ${error.message}`);
    console.log(`  ✓ Classroom session ${sess.id} (${sess.status})`);
  }

  // 7. Ensure Classroom Participants
  const participants = [
    {
      id: "d8b1d977-9b2f-4e94-8bf4-6ef26e5a0201",
      session_id: SEED_DATA.activeSession.id,
      workspace_id: SEED_DATA.workspace.id,
      user_id: SEED_DATA.teacher.id,
      display_name: "Teacher Sharon",
      role: "teacher",
      permission_level: "full_interactive",
    },
    {
      id: "d8b1d977-9b2f-4e94-8bf4-6ef26e5a0202",
      session_id: SEED_DATA.activeSession.id,
      workspace_id: SEED_DATA.workspace.id,
      user_id: SEED_DATA.family.id,
      display_name: "David Del Rosario",
      role: "family",
      permission_level: "view_only",
    },
  ];

  for (const p of participants) {
    const { error } = await supabase.from("classroom_participants").upsert(p, { onConflict: "id" });
    if (error) throw new Error(`Participant upsert failed for participant ${p.id}: ${error.message}`);
    console.log(`  ✓ Participant ${p.user_id} in session ${p.session_id}`);
  }

  // 8. Fail-closed Verification of Seeded Auth Credentials
  console.log("Verifying seeded credentials authentication...");
  const verifyClient = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: teacherAuth, error: teacherAuthError } = await verifyClient.auth.signInWithPassword({
    email: SEED_DATA.teacher.email,
    password: SEED_DATA.teacher.password,
  });
  if (teacherAuthError || !teacherAuth?.session) {
    throw new Error(`Seeded auth verification failed for teacher: ${teacherAuthError ? teacherAuthError.message : "No session"}`);
  }

  const { data: familyAuth, error: familyAuthError } = await verifyClient.auth.signInWithPassword({
    email: SEED_DATA.family.email,
    password: SEED_DATA.family.password,
  });
  if (familyAuthError || !familyAuth?.session) {
    throw new Error(`Seeded auth verification failed for family: ${familyAuthError ? familyAuthError.message : "No session"}`);
  }

  console.log("  ✓ Seeded credentials authenticated successfully for both teacher and family accounts");
  console.log("Database seeded successfully!");
}

module.exports = {
  seedLocalDatabase,
  SEED_DATA,
};

if (require.main === module) {
  seedLocalDatabase().catch(err => {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  });
}
