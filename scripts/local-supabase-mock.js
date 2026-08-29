const http = require("http");

function createLocalSupabaseMockServer(port = 54321) {
  const users = {
    "teacher@wonderjourney.app": {
      id: "usr_teacher_001",
      email: "teacher@wonderjourney.app",
      role: "teacher",
      display_name: "Teacher Sharon",
      family_id: "fam_del_rosario"
    },
    "family@wonderjourney.app": {
      id: "usr_family_002",
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

  const server = http.createServer((req, res) => {
    // Set CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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
        const user = tokens[token];
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
          matchedUser = tokens[token];
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

      // 4. Classroom Sessions REST Query
      if (url.pathname.includes("/rest/v1/classroom_sessions")) {
        const idFilter = url.searchParams.get("id");
        const workspaceFilter = url.searchParams.get("workspace_id");
        const lessonFilter = url.searchParams.get("lesson_id");
        const statusFilter = url.searchParams.get("status");

        const targetId = idFilter ? idFilter.replace("eq.", "") : "sess-fam_del_rosario-main";
        const targetWorkspace = workspaceFilter ? workspaceFilter.replace("eq.", "") : "ws-fam_del_rosario";
        const targetLesson = lessonFilter ? lessonFilter.replace("eq.", "") : "lesson-1-world-map";
        const targetStatus = statusFilter ? statusFilter.replace("eq.", "") : "active";

        // Rejection for non-existent session IDs or cross-workspace mismatches
        if (targetId.includes("fake") || targetId.includes("invalid") || targetId.includes("forged") || targetWorkspace.includes("other") || targetStatus === "completed") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([]));
          return;
        }

        const sessionRow = {
          id: targetId,
          workspace_id: targetWorkspace,
          lesson_id: targetLesson,
          room_name: `room-${targetId}`,
          teacher_user_id: "usr_teacher_001",
          status: "active",
          slide_index: 0,
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

      // 5. Classroom Participants REST Query
      if (url.pathname.includes("/rest/v1/classroom_participants")) {
        const sessionFilter = url.searchParams.get("session_id");
        const userFilter = url.searchParams.get("user_id");

        const targetSessionId = sessionFilter ? sessionFilter.replace("eq.", "") : "";
        const targetUserId = userFilter ? userFilter.replace("eq.", "") : "";

        if (targetSessionId.includes("fake") || targetUserId.includes("fake") || targetUserId.includes("unauthorized") || targetUserId.includes("intruder")) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([]));
          return;
        }

        const participantRow = {
          id: `part-${targetSessionId}-${targetUserId || "usr_family_002"}`,
          session_id: targetSessionId,
          workspace_id: "ws-fam_del_rosario",
          user_id: targetUserId || "usr_family_002",
          role: targetUserId === "usr_teacher_001" ? "teacher" : "student",
          permission_level: "full_interactive",
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

      // 6. Game Evaluation Nonces (Atomic Unique Consumption)
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
