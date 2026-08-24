import Image from "next/image";
import { LatestCommitPill } from "./latest-commit-pill";
import { LiveUsers } from "./live-users";
import { WavyBackground } from "./wavy-background";

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
          "linear-gradient(135deg, color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%), linear-gradient(var(--bg-card), var(--bg-card)), var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      {/* wavy animated backdrop */}
      <WavyBackground
        containerClassName="absolute inset-0"
        waveOpacity={0.35}
        blur={12}
        speed="slow"
        waveWidth={40}
      />

      {/* Glow dot */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-[100px]"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative grid items-center gap-6 px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1fr_480px]">
        {/* LEFT: title + tagline */}
        <div className="min-w-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center">
              <Image priority src="/favicon-new.png" alt="FMW Logo - Free Media World Directory" width={80} height={80} className="h-14 w-14 sm:h-20 sm:w-20 object-contain" />
            </div>
            <div>
              <div className="text-[11px] sm:text-[12px] leading-[14px] font-[600] text-[rgb(139,92,246)] uppercase tracking-[0.2em] mb-1" style={{ fontFamily: '__Inter_f367f3, __Inter_Fallback_f367f3, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
                [FMW]
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-wide text-white whitespace-nowrap" style={{ fontFamily: '"Bebas Neue", "Bebas Neue Fallback", sans-serif' }}>
                Your streaming{" "}
                <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--fg)] to-[var(--accent)] bg-clip-text text-transparent">
                  everything
                </span>
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-xs sm:text-sm font-medium leading-relaxed text-[var(--fg-muted)]">
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
              <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-[480px]">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border px-3.5 py-2.5 text-center transition-all duration-200"
                    style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
                  >
                    <div className="text-xl font-extrabold text-white">{s.value}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--fg-muted)]">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-col gap-2 w-full max-w-[480px]">
              <LatestCommitPill />
              <LiveUsers />
            </div>
          </div>
        </div>

        {/* RIGHT: stats + live data */}
        <aside className="hidden flex-col gap-2.5 lg:flex w-full max-w-[480px] ml-auto">
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border px-3.5 py-3 text-center transition-all duration-300 hover:scale-105 hover:border-[var(--border-strong)] hover:shadow-lg"
                  style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}
                >
                  <div className="text-2xl font-extrabold tracking-tight tabular-nums text-white">{s.value}</div>
                  <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.15em] text-[var(--fg-muted)]">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <LatestCommitPill />
            <LiveUsers />
          </div>
        </aside>
      </div>
    </section>
  );
}

