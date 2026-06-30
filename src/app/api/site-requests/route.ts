import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Target {
  region: string;
  categoryId: string;
}

interface SubmitBody {
  siteUrl?: string;
  siteName?: string;
  siteFeature?: string;
  targets?: Target[];
}

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

function isValidUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const h = headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "unknown";

  if (!checkRate(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: SubmitBody;
  try {
    body = (await req.json()) as SubmitBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const siteUrl = body.siteUrl?.trim() ?? "";
  const siteName = body.siteName?.trim() ?? "";
  const siteFeature = body.siteFeature?.trim() ?? "";
  const targets = Array.isArray(body.targets) ? body.targets : [];

  if (!siteUrl || !siteName || !siteFeature) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!isValidUrl(siteUrl)) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  if (siteName.length > 120 || siteFeature.length > 2000) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }
  const cleanTargets = targets
    .filter(
      (t): t is Target =>
        !!t && typeof t.region === "string" && typeof t.categoryId === "string" && t.region.length > 0 && t.categoryId.length > 0,
    )
    .slice(0, 20);
  if (cleanTargets.length === 0) {
    return NextResponse.json({ error: "no_targets" }, { status: 400 });
  }

  const webhookUrl = env.DISCORD_WEBHOOK();
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK is not set");
    return NextResponse.json({ error: "discord_not_configured" }, { status: 503 });
  }

  const payload = {
    content: "🆕 **New Link Request Submitted!**",
    embeds: [
      {
        title: siteName,
        color: 3447003,
        fields: [
          { name: "URL", value: siteUrl, inline: true },
          { name: "Features / Description", value: siteFeature },
          {
            name: "Requested Target(s)",
            value: cleanTargets.map((t) => `${t.region} / ${t.categoryId}`).join("\n"),
          },
          { name: "Submitter IP", value: ip, inline: true },
          { name: "User Agent", value: h.get("user-agent") ?? "unknown", inline: true }
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Discord returned ${res.status}`);
    }
  } catch (e) {
    console.error("site-request Discord send failed", e);
    return NextResponse.json({ error: "discord_error" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
