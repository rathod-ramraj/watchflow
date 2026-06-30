"use client";

import { useState } from "react";
import { Link2, Tag, Target, Star, Plus, X, Send } from "lucide-react";
import { useRegions } from "@/components/region-context";
import { CATEGORY_META } from "@/lib/constants";

interface TargetRow {
  id: number;
  region: string;
  category: string;
}

const SUBMIT_URL = "/api/site-requests";

export function RequestForm() {
  const { regions } = useRegions();
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [why, setWhy] = useState("");
  const [targets, setTargets] = useState<TargetRow[]>([{ id: 1, region: "", category: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTarget() {
    setTargets((t) => [...t, { id: Date.now(), region: "", category: "" }]);
  }
  function removeTarget(id: number) {
    setTargets((t) => (t.length > 1 ? t.filter((r) => r.id !== id) : t));
  }
  function updateTarget(id: number, key: "region" | "category", value: string) {
    setTargets((t) => t.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const valid = targets.filter((t) => t.region && t.category).map((t) => ({ region: t.region, categoryId: t.category }));
    if (!valid.length) {
      setError("Pick at least one region + section.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl: url,
          siteName: name,
          siteFeature: why,
          targets: valid,
          submittedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Submission failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="watchflow-card p-8 text-center">
        <div className="mb-3 text-4xl">✅</div>
        <h3 className="text-lg font-bold">Request sent successfully!</h3>
        <p className="mt-2 text-[var(--fg-muted)]">Thanks for your submission. We&apos;ll review it and add quality sites to the list.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field icon={<Link2 size={15} />} label="Site URL">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-2xl border bg-[var(--bg-elev)]/50 px-4.5 py-3 text-sm font-semibold text-white outline-none placeholder:text-[var(--fg-muted)] border-[var(--border)] transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]/40 shadow-inner"
        />
      </Field>

      <Field icon={<Tag size={15} />} label="Site Name">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Awesome Streaming Site"
          className="w-full rounded-2xl border bg-[var(--bg-elev)]/50 px-4.5 py-3 text-sm font-semibold text-white outline-none placeholder:text-[var(--fg-muted)] border-[var(--border)] transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]/40 shadow-inner"
        />
      </Field>

      <div>
        <Label icon={<Target size={15} />}>
          Where should it go?{" "}
          <span className="font-medium text-[var(--fg-muted)] text-xs block sm:inline sm:ml-1.5">(add as many region + section pairs as you like)</span>
        </Label>
        <div className="space-y-3">
          {targets.map((row) => (
            <div key={row.id} className="flex flex-col gap-2.5 sm:flex-row">
              <select
                required
                value={row.region}
                onChange={(e) => updateTarget(row.id, "region", e.target.value)}
                className="w-full sm:flex-1 rounded-2xl border bg-[var(--bg-elev)]/50 px-4 py-3 text-sm font-semibold text-white outline-none border-[var(--border)] transition-all duration-300 focus:border-[var(--accent)] cursor-pointer"
              >
                <option value="" className="bg-[var(--bg-elev)] text-[var(--fg-muted)]">Select region</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code} className="bg-[var(--bg-elev)] text-[var(--fg)]">{r.flag} {r.name}</option>
                ))}
              </select>
              <div className="flex gap-2.5 flex-1">
                <select
                  required
                  value={row.category}
                  onChange={(e) => updateTarget(row.id, "category", e.target.value)}
                  className="w-full flex-1 rounded-2xl border bg-[var(--bg-elev)]/50 px-4 py-3 text-sm font-semibold text-white outline-none border-[var(--border)] transition-all duration-300 focus:border-[var(--accent)] cursor-pointer"
                >
                  <option value="" className="bg-[var(--bg-elev)] text-[var(--fg-muted)]">Select section</option>
                  {Object.entries(CATEGORY_META).map(([id, m]) => (
                    <option key={id} value={id} className="bg-[var(--bg-elev)] text-[var(--fg)]">{m.icon} {m.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  aria-label="Remove"
                  disabled={targets.length <= 1}
                  onClick={() => removeTarget(row.id)}
                  className="watchflow-pill inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-[var(--border)] shrink-0 disabled:opacity-30 cursor-pointer hover:border-[var(--danger)] hover:text-[var(--danger)]"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTarget}
          className="watchflow-pill mt-4 inline-flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold shadow-md cursor-pointer active:scale-95"
        >
          <Plus size={14} className="text-[var(--accent)]" /> Add another region/section
        </button>
      </div>

      <Field icon={<Star size={15} />} label="Why should we add it?">
        <textarea
          required
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          rows={4}
          placeholder="Tell us what makes this site special… (large library, fast streaming, mobile-friendly, etc.)"
          className="w-full rounded-2xl border bg-[var(--bg-elev)]/50 px-4.5 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-[var(--fg-muted)] border-[var(--border)] transition-all duration-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]/40 resize-y min-h-[100px] shadow-inner"
        />
      </Field>

      {error && (
        <div className="rounded-2xl border px-4 py-3 text-sm font-semibold bg-[var(--danger)]/5 shadow-md" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold text-white cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 sm:w-auto shadow-lg"
        style={{ background: "var(--accent)", boxShadow: "0 8px 24px var(--accent-glow)" }}
      >
        <Send size={13} className="transition-transform group-hover:translate-x-0.5" />
        {submitting ? "Submitting request…" : "Submit Request"}
      </button>
    </form>
  );
}

function Label({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <label className="mb-2 flex items-center gap-2.5 text-sm font-bold text-white tracking-tight">
      <span className="text-[var(--accent)]">{icon}</span> {children}
    </label>
  );
}

function Field({ children, label, icon }: { children: React.ReactNode; label: string; icon: React.ReactNode }) {
  return (
    <div>
      <Label icon={icon}>{label}</Label>
      {children}
    </div>
  );
}
