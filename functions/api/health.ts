import { json, type Ctx } from "../_shared";

// 🩺 HEALTH CHECK — a safe, public read of "is the server configured?"
// Returns ONLY booleans (never the secret values), so anyone can verify
// a deploy picked up its variables and KV binding without exposing keys.
//   GET /api/health
export const onRequest = async ({ env }: Ctx): Promise<Response> => {
  return json({
    ok: true,
    builtAt: "2026-07-18-antiglitch",
    config: {
      livekitUrl: !!env.LIVEKIT_URL,
      livekitKey: !!env.LIVEKIT_API_KEY,
      livekitSecret: !!env.LIVEKIT_API_SECRET,
      classroomCode: !!(env.WJ_CLASS_CODE || env.CLASSROOM_CODE),
      teacherCode: !!env.WJ_TEACHER_CODE,
      kvStorage: !!env.WONDER_JOURNEY,
    },
  });
};
