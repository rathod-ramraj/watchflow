import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-[var(--fg-muted)] md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold">
          <Link href="/about" className="transition-colors duration-200 hover:text-[var(--fg)]">About</Link>
          <Link href="/request" className="transition-colors duration-200 hover:text-[var(--fg)]">Request</Link>
          <Link href="/dmca" className="transition-colors duration-200 hover:text-[var(--fg)]">DMCA</Link>
          <a href="https://github.com/N3rdmade/WatchFlow/" target="_blank" rel="noreferrer" className="transition-colors duration-200 hover:text-[var(--fg)]">GitHub</a>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center md:items-end md:text-right">
          <div className="font-medium text-[var(--fg)]">Curated with <span className="text-[var(--accent)] animate-pulse inline-block">💜</span> by the WatchFlow Team</div>
          <div className="text-xs text-[var(--fg-muted)] opacity-80">© {new Date().getFullYear()} WatchFlow. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

