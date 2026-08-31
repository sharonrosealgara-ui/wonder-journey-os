// scripts/seed-local-database.js
// Seeds the real local PostgreSQL/Supabase database with users, workspaces, sessions, and participants.

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4Mzg3NjgwMH0.EG-demo-service-role-key-for-local-development";

const SEED_DATA = {
  teacher: {
    id: "e8b1d977-9b2f-4e94-8bf4-6ef26e5a0001",
    email: "teacher@wonderjourney.app",
    password: "Teacher123!",
    role: "teacher",
    display_name: "Teacher Sharon",
  },
  family: {
    id: "f8b1d977-9b2f-4e94-8bf4-6ef26e5a0002",
    email: "family@wonderjourney.app",
    password: "Family123!",
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
    lesson_id: "lesson-1-world-map",
    slide_index: 0,
    room_name: "room-c8b1d977-9b2f-4e94-8bf4-6ef26e5a0100",
    status: "active",
  },
  inactiveSession: {
    id: "c8b1d977-9b2f-4e94-8bf4-6ef26e5a0101",
    workspace_id: "a8b1d977-9b2f-4e94-8bf4-6ef26e5a0010",
    lesson_id: "lesson-1-world-map",
    slide_index: 0,
    room_name: "room-c8b1d977-9b2f-4e94-8bf4-6ef26e5a0101",
    status: "completed",
  },
};

async function seedLocalDatabase() {
  console.log(`Seeding database at ${SUPABASE_URL}...`);
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Create or ensure Auth Users
  for (const userSpec of [SEED_DATA.teacher, SEED_DATA.family]) {
    try {
      const { data: userList } = await supabase.auth.admin.listUsers();
      const existing = userList?.users?.find(u => u.email === userSpec.email || u.id === userSpec.id);
      if (!existing) {
        await supabase.auth.admin.createUser({
          id: userSpec.id,
          email: userSpec.email,
          password: userSpec.password,
          email_confirm: true,
          user_metadata: { name: userSpec.display_name },
        });
        console.log(`  ✓ Created auth user ${userSpec.email} (${userSpec.id})`);
      } else {
        console.log(`  ✓ Auth user ${userSpec.email} already exists`);
      }
    } catch (e) {
      console.warn(`  ! Auth user creation note: ${e.message}`);
    }
  }

  // 2. Ensure Workspaces
  for (const ws of [SEED_DATA.workspace, SEED_DATA.otherWorkspace]) {
    const { error } = await supabase.from("workspaces").upsert(ws, { onConflict: "id" });
    if (error) console.warn(`  ! Workspace upsert note: ${error.message}`);
    else console.log(`  ✓ Workspace ${ws.slug} (${ws.id})`);
  }

  // 3. Ensure Profiles
  for (const userSpec of [SEED_DATA.teacher, SEED_DATA.family]) {
    const { error } = await supabase.from("profiles").upsert({
      id: userSpec.id,
      email: userSpec.email,
      role: userSpec.role,
      display_name: userSpec.display_name,
      family_id: "fam_del_rosario",
    }, { onConflict: "id" });
    if (error) console.warn(`  ! Profile upsert note: ${error.message}`);
    else console.log(`  ✓ Profile for ${userSpec.email}`);
  }

  // 4. Ensure Workspace Members
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
    if (error) console.warn(`  ! Membership upsert note: ${error.message}`);
    else console.log(`  ✓ Membership user ${m.user_id} in workspace ${m.workspace_id}`);
  }

  // 5. Ensure Classroom Sessions
  for (const sess of [SEED_DATA.activeSession, SEED_DATA.inactiveSession]) {
    const { error } = await supabase.from("classroom_sessions").upsert(sess, { onConflict: "id" });
    if (error) console.warn(`  ! Session upsert note: ${error.message}`);
    else console.log(`  ✓ Classroom session ${sess.id} (${sess.status})`);
  }

  // 6. Ensure Classroom Participants
  const participants = [
    {
      session_id: SEED_DATA.activeSession.id,
      user_id: SEED_DATA.teacher.id,
      role: "teacher",
      permission_level: "full_interactive",
    },
    {
      session_id: SEED_DATA.activeSession.id,
      user_id: SEED_DATA.family.id,
      role: "family",
      permission_level: "view_only",
    },
  ];

  for (const p of participants) {
    const { error } = await supabase.from("classroom_participants").upsert(p, { onConflict: "session_id,user_id" });
    if (error) console.warn(`  ! Participant upsert note: ${error.message}`);
    else console.log(`  ✓ Participant ${p.user_id} in session ${p.session_id}`);
  }

  console.log("✓ Database seeding complete.\n");
}

module.exports = {
  seedLocalDatabase,
  SEED_DATA,
};

if (require.main === module) {
  seedLocalDatabase().catch(err => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
}
