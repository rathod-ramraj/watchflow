import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Globe2, LayoutGrid, Inbox, ExternalLink, Wrench } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getRegions, getLinksForRegion } from "@/lib/data";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Dashboard · Cinex Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function getStats() {
  const regions = await getRegions();
  const usa = await getLinksForRegion("USA");
  const siteCount = usa.categories.reduce((sum, c) => sum + c.sites.length, 0);

  let pendingRequests = 0;
  try {
    const db = getDb();
    const row = db
      .prepare(
        "SELECT COUNT(*) as c FROM site_requests WHERE status = 'pending' OR status IS NULL",
      )
      .get() as { c: number } | undefined;
    pendingRequests = row?.c ?? 0;
  } catch {
    // DB unreachable — leave as 0
  }

  return {
    regions: regions.length,
    categories: usa.categories.length,
    sites: siteCount,
    pendingRequests,
  };
}

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin-panel/login");

  const stats = await getStats();
  const repo = `${env.REPO_OWNER()}/${env.REPO_NAME()}`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.githubLogin}</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Editing{" "}
          <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[var(--accent)] hover:underline"
          >
            {repo}
            <ExternalLink size={11} className="ml-0.5 inline-block" />
          </a>{" "}
          on branch <span className="font-mono">{env.REPO_BRANCH()}</span>. All changes commit
          directly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Regions" value={stats.regions} />
        <StatCard label="Categories" value={stats.categories} />
        <StatCard label="Sites (USA)" value={stats.sites} />
        <StatCard label="Pending requests" value={stats.pendingRequests} highlight={stats.pendingRequests > 0} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ActionCard
          href="/admin-panel/sites"
          icon={<LayoutGrid size={18} />}
          title="Edit sites"
          body="Reorder categories, add or remove sites, upload logos. Saves commit directly to GitHub."
        />
        <ActionCard
          href="/admin-panel/regions"
          icon={<Globe2 size={18} />}
          title="Manage regions"
          body="Toggle countries on/off, edit region metadata, set the default landing region."
        />
        <ActionCard
          href="/admin-panel/requests"
          icon={<Inbox size={18} />}
          title="Site requests"
          body={
            stats.pendingRequests > 0
              ? `${stats.pendingRequests} pending — review and approve from the inbox.`
              : "No pending requests. Submissions from the public form land here."
          }
          badge={stats.pendingRequests > 0 ? String(stats.pendingRequests) : undefined}
        />
        <ActionCard
          href="/admin-panel/tools"
          icon={<Wrench size={18} />}
          title="Power tools"
          body="Scan for orphan logos, replace domains across all regions, run a health check, fill empty categories."
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderColor: highlight ? "var(--accent)" : "var(--border)",
        background: highlight
          ? "color-mix(in oklab, var(--accent) 8%, var(--bg-card))"
          : "var(--bg-card)",
        boxShadow: highlight ? "0 0 16px color-mix(in oklab, var(--accent) 12%, transparent)" : undefined,
      }}
    >
      <div className="text-2xl font-extrabold tracking-tight tabular-nums sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-medium text-[var(--fg-muted)]">{label}</div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  body,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg active:scale-[0.99]"
      style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:bg-[var(--accent)] group-hover:text-white"
          style={{ background: "var(--bg-elev)", color: "var(--accent)" }}
        >
          {icon}
        </div>
        <h3 className="font-bold text-base tracking-tight transition-colors group-hover:text-[var(--accent)]">{title}</h3>
        {badge && (
          <span
            className="ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
            style={{ background: "var(--accent)" }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-xs font-normal leading-relaxed text-[var(--fg-muted)]">{body}</p>
    </Link>
  );
}
