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
