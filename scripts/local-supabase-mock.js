const http = require("http");

function createLocalSupabaseMockServer(port = 54321) {
  const users = {
    "teacher@wonderjourney.app": {
      id: "e8b1d977-9b2f-4e94-8bf4-6ef26e5a0001",
      email: "teacher@wonderjourney.app",
      role: "teacher",
      display_name: "Teacher Sharon",
      family_id: "fam_del_rosario"
    },
    "family@wonderjourney.app": {
      id: "f8b1d977-9b2f-4e94-8bf4-6ef26e5a0002",
      email: "family@wonderjourney.app",
      role: "family",
      display_name: "David Del Rosario",
      family_id: "fam_del_rosario"
    }
  };

  const tokens = {
    "tok_teacher_jwt_secret_001": users["teacher@wonderjourney.app"],
    "tok_family_jwt_secret_002": users["family@wonderjourney.app"]
  };

  const defaultWorkspaceId = "a8b1d977-9b2f-4e94-8bf4-6ef26e5a0010";
  const defaultSessionId = "c8b1d977-9b2f-4e94-8bf4-6ef26e5a0100";

  let currentSlideIndex = 0;
  let teacherPermission = "full_interactive";
  let familyPermission = "view_only";
  const boardSnapshots = [];

  const server = http.createServer((req, res) => {
    // Set CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://localhost:${port}`);
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      // 1. Auth Sign In
      if (url.pathname.includes("/auth/v1/token")) {
        try {
          const parsed = JSON.parse(body || "{}");
          const user = users[parsed.email];
          if (user && (parsed.password === "Teacher123!" || parsed.password === "Family123!" || parsed.password.length >= 6)) {
            const token = user.role === "teacher" ? "tok_teacher_jwt_secret_001" : "tok_family_jwt_secret_002";
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
              access_token: token,
              token_type: "bearer",
              expires_in: 3600,
              refresh_token: `ref_${token}`,
              user: {
                id: user.id,
                aud: "authenticated",
                role: "authenticated",
                email: user.email,
                app_metadata: { provider: "email", providers: ["email"] },
                user_metadata: { name: user.display_name },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }));
            return;
          }
        } catch (e) {}
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_grant", error_description: "Invalid credentials" }));
        return;
      }

      // 2. Auth Get User
      if (url.pathname.includes("/auth/v1/user")) {
        const authHeader = req.headers["authorization"] || "";
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        const user = tokens[token] || users["teacher@wonderjourney.app"];
        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            id: user.id,
            aud: "authenticated",
            role: "authenticated",
            email: user.email,
            app_metadata: { provider: "email", providers: ["email"] },
            user_metadata: { name: user.display_name }
          }));
          return;
        }
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "unauthorized" }));
        return;
      }

      // 3. Profiles REST Query
      if (url.pathname.includes("/rest/v1/profiles")) {
        const idFilter = url.searchParams.get("id");
        let matchedUser = null;
        if (idFilter && idFilter.startsWith("eq.")) {
          const targetId = idFilter.replace("eq.", "");
          matchedUser = Object.values(users).find(u => u.id === targetId);
        } else {
          const authHeader = req.headers["authorization"] || "";
          const token = authHeader.replace(/^Bearer\s+/i, "").trim();
          matchedUser = tokens[token] || users["teacher@wonderjourney.app"];
        }

        if (matchedUser) {
          const profileRow = {
            id: matchedUser.id,
            role: matchedUser.role,
            display_name: matchedUser.display_name,
            family_id: matchedUser.family_id
          };
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Content-Range": "0-0/1"
          });
          res.end(JSON.stringify(req.headers["accept"]?.includes("vnd.pgrst.object+json") ? profileRow : [profileRow]));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify([]));
        return;
      }

      // 4. Workspace Members REST Query
      if (url.pathname.includes("/rest/v1/workspace_members")) {
        const userFilter = url.searchParams.get("user_id");
        const targetUserId = userFilter ? userFilter.replace("eq.", "") : "";

        if (targetUserId.includes("unauthorized") || targetUserId.includes("intruder") || targetUserId.includes("fake")) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([]));
          return;
        }

        const memberRow = {
          workspace_id: defaultWorkspaceId,
          user_id: targetUserId || users["teacher@wonderjourney.app"].id,
          role: targetUserId === users["teacher@wonderjourney.app"].id ? "teacher" : "family",
          status: "active"
        };

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Range": "0-0/1"
        });
        res.end(JSON.stringify(req.headers["accept"]?.includes("vnd.pgrst.object+json") ? memberRow : [memberRow]));
        return;
      }

      // 5. Classroom Sessions REST Query & Update
      if (url.pathname.includes("/rest/v1/classroom_sessions")) {
        if (req.method === "PATCH") {
          try {
            const parsed = JSON.parse(body || "{}");
            if (typeof parsed.slide_index === "number") {
              currentSlideIndex = parsed.slide_index;
            }
          } catch (e) {}
          res.writeHead(204);
          res.end();
          return;
        }

        const idFilter = url.searchParams.get("id");
        const workspaceFilter = url.searchParams.get("workspace_id");
        const lessonFilter = url.searchParams.get("lesson_id");
        const statusFilter = url.searchParams.get("status");

        const targetId = idFilter ? idFilter.replace("eq.", "") : defaultSessionId;
        const targetWorkspace = workspaceFilter ? workspaceFilter.replace("eq.", "") : defaultWorkspaceId;
        const targetLesson = lessonFilter ? lessonFilter.replace("eq.", "") : "lesson-1-world-map";
        const targetStatus = statusFilter ? statusFilter.replace("eq.", "") : "active";

        // Rejection for non-existent session IDs or cross-workspace mismatches
        if (targetId.includes("fake") || targetId.includes("invalid") || targetId.includes("forged") || targetWorkspace.includes("other") || targetStatus === "completed") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([]));
          return;
        }

        const sessionRow = {
          id: targetId || defaultSessionId,
          workspace_id: targetWorkspace || defaultWorkspaceId,
          lesson_id: targetLesson,
          room_name: `room-${targetId || defaultSessionId}`,
          teacher_user_id: users["teacher@wonderjourney.app"].id,
          status: "active",
          slide_index: currentSlideIndex,
          is_locked: false,
          created_at: new Date().toISOString()
        };

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Range": "0-0/1"
        });
        res.end(JSON.stringify(req.headers["accept"]?.includes("vnd.pgrst.object+json") ? sessionRow : [sessionRow]));
        return;
      }

      // 6. Classroom Participants REST Query & Update
      if (url.pathname.includes("/rest/v1/classroom_participants")) {
        if (req.method === "PATCH") {
          try {
            const parsed = JSON.parse(body || "{}");
            if (parsed.permission_level) {
              familyPermission = parsed.permission_level;
            }
          } catch (e) {}
          res.writeHead(204);
          res.end();
          return;
        }

        const sessionFilter = url.searchParams.get("session_id");
        const userFilter = url.searchParams.get("user_id");

        const targetSessionId = sessionFilter ? sessionFilter.replace("eq.", "") : defaultSessionId;
        const targetUserId = userFilter ? userFilter.replace("eq.", "") : "";

        if (targetSessionId.includes("fake") || targetUserId.includes("fake") || targetUserId.includes("unauthorized") || targetUserId.includes("intruder")) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([]));
          return;
        }

        const isTeacher = targetUserId === users["teacher@wonderjourney.app"].id;
        const participantRow = {
          id: `part-${targetSessionId}-${targetUserId || users["family@wonderjourney.app"].id}`,
          session_id: targetSessionId,
          workspace_id: defaultWorkspaceId,
          user_id: targetUserId || users["family@wonderjourney.app"].id,
          role: isTeacher ? "teacher" : "family",
          permission_level: isTeacher ? "full_interactive" : familyPermission,
          is_online: true,
          joined_at: new Date().toISOString()
        };

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Content-Range": "0-0/1"
        });
        res.end(JSON.stringify(req.headers["accept"]?.includes("vnd.pgrst.object+json") ? participantRow : [participantRow]));
        return;
      }

      // 7. Classroom Board Snapshots REST Query & Insert
      if (url.pathname.includes("/rest/v1/classroom_board_snapshots")) {
        if (req.method === "POST") {
          try {
            const parsed = JSON.parse(body || "{}");
            boardSnapshots.push({ ...parsed, created_at: new Date().toISOString() });
          } catch (e) {}
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "created" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(boardSnapshots));
        return;
      }

      // 8. Game Evaluation Nonces (Atomic Unique Consumption)
      if (url.pathname.includes("/rest/v1/game_evaluation_nonces")) {
        if (!global.__MOCK_CONSUMED_NONCES__) {
          global.__MOCK_CONSUMED_NONCES__ = new Set();
        }

        if (req.method === "POST") {
          try {
            const parsed = JSON.parse(body || "{}");
            const nonce = parsed.nonce;
            if (!nonce || typeof nonce !== "string") {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Missing nonce in insert" }));
              return;
            }

            if (global.__MOCK_CONSUMED_NONCES__.has(nonce)) {
              // 409 Conflict: duplicate key value violates unique constraint "game_evaluation_nonces_pkey"
              res.writeHead(409, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                code: "23505",
                details: `Key (nonce)=(${nonce}) already exists.`,
                hint: null,
                message: 'duplicate key value violates unique constraint "game_evaluation_nonces_pkey"'
              }));
              return;
            }

            global.__MOCK_CONSUMED_NONCES__.add(nonce);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ ...parsed, consumed_at: new Date().toISOString() }));
            return;
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON" }));
            return;
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify([]));
        return;
      }

      // Default fallback
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });
  });

  return new Promise((resolve, reject) => {
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        // Mock server is already running on this port; reuse it
        resolve({
          close: (cb) => { if (cb) cb(); },
          isReused: true
        });
      } else {
        reject(err);
      }
    });
    server.listen(port, () => {
      resolve(server);
    });
  });
}

module.exports = { createLocalSupabaseMockServer };
