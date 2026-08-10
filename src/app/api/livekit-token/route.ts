import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, room, role: clientRole, code } = body;

    if (!name || !room) {
      return NextResponse.json({ error: "Missing name or room" }, { status: 400 });
    }

    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get true role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 401 });
    }

    const trueRole = profile.role;

    // Preserve class code only as room-access protection
    const validCode = process.env.WJ_CLASS_CODE || process.env.CLASSROOM_CODE;
    if (validCode && code !== validCode) {
      return NextResponse.json({ error: "Invalid class code" }, { status: 401 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "LiveKit not configured" }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: `${trueRole}-${user.id}`, // Ensure unique identity
      name: name,
      metadata: JSON.stringify({ role: trueRole })
    });

    // Grant room access
    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: trueRole === "teacher" // Only teachers get roomAdmin
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: wsUrl,
      role: trueRole
    });

  } catch (error) {
    console.error("LiveKit token error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
