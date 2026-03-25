export const runtime = "nodejs";

import { cookies, headers } from "next/headers";
import crypto from "crypto";

function sha256(value: string) {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, signup_method } = body;

    if (!email) {
      return Response.json(
        { ok: false, error: "Missing email" },
        { status: 400 }
      );
    }

    const pixelId = process.env.META_PIXEL_ID;
    const token = process.env.META_CAPI_TOKEN;

    if (!pixelId || !token) {
      return Response.json(
        { ok: false, error: "Missing META env vars" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const headerStore = await headers();

    const fbp = cookieStore.get("_fbp")?.value;
    const fbc = cookieStore.get("_fbc")?.value;
    const userAgent = headerStore.get("user-agent") || "";
    const forwardedFor = headerStore.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "";

    const payload = {
      data: [
        {
          event_name: "CompleteRegistration",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: "https://www.wanderwise.uk/signup",
          user_data: {
            em: [sha256(email)],
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
            ...(clientIp ? { client_ip_address: clientIp } : {}),
            ...(userAgent ? { client_user_agent: userAgent } : {}),
          },
          custom_data: {
            signup_method: signup_method || "email",
          },
        },
      ],
    };

    const qs = new URLSearchParams({
      access_token: token,
    });

    const url = `https://graph.facebook.com/v18.0/${pixelId}/events?${qs.toString()}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let json: unknown = null;

    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }

    if (!res.ok) {
      console.error("Meta CAPI route error:", json);
      return Response.json(
        { ok: false, meta: json },
        { status: res.status }
      );
    }

    console.log("Meta CAPI route success:", json);

    return Response.json({ ok: true, meta: json });
  } catch (error) {
    console.error("Route failure:", error);

    return Response.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}