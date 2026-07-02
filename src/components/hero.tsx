import Image from "next/image";
import { LatestCommitPill } from "./latest-commit-pill";
import { LiveUsers } from "./live-users";

interface Stat {
  label: string;
  value: number | string;
}

interface Props {
  regionFlag?: string;
  regionName?: string;
  stats?: Stat[];
}

export function Hero({ regionFlag, regionName, stats }: Props) {
  return (
    <section
      className="relative mb-8 overflow-hidden rounded-[24px] border shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%), var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Glow dot */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-[100px]"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative grid items-center gap-8 px-6 py-10 md:px-12 md:py-14 lg:grid-cols-[1.3fr_1fr]">
        {/* LEFT: title + tagline */}
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center transition-transform hover:rotate-6">
              <Image src="/favicon-new.png" alt="WatchFlow" width={80} height={80} className="h-20 w-20 object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl text-white">
                Your streaming{" "}
                <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--fg)] to-[var(--accent)] bg-clip-text text-transparent">
                  everything
                </span>
              </h1>
            </div>
          </div>
          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-[var(--fg-muted)] md:text-base">
            Curated streaming sites, instant fuzzy search, multi-region support.
            {regionName && (
              <>
                {" "}Showing{" "}
                <span className="font-bold text-[var(--fg)] bg-[var(--bg-card-hover)] border border-[var(--border)] px-2 py-0.5 rounded-full text-xs inline-flex items-center gap-1">
                  <span>{regionFlag}</span> <span>{regionName}</span>
                </span>
                .
              </>
            )}
          </p>

          {/* Mobile-only stats and indicators */}
          <div className="lg:hidden">
            {stats && stats.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border px-3 py-3 text-center transition-all duration-200"
                    style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
                  >
                    <div className="text-xl font-extrabold text-white">{s.value}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <LatestCommitPill />
              <LiveUsers />
            </div>
          </div>
        </div>

        {/* RIGHT: stats + live data */}
        <aside className="hidden flex-col gap-4 lg:flex">
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3.5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border px-4 py-3.5 text-center transition-all duration-300 hover:scale-105 hover:border-[var(--border-strong)] hover:shadow-lg"
                  style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
                >
                  <div className="text-3xl font-extrabold tracking-tight tabular-nums text-white">{s.value}</div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <LatestCommitPill />
            <LiveUsers />
          </div>
        </aside>
      </div>
    </section>
  );
}

