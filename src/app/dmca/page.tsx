import type { Metadata } from "next";
import { CheckCircle2, Mail } from "lucide-react";

export const metadata: Metadata = { title: "DMCA Policy" };

const STEPS = [
  { n: 1, title: "Review", body: "We review all valid DMCA requests submitted via email." },
  { n: 2, title: "Verify", body: "We verify that all required information is included." },
  { n: 3, title: "Action", body: "We remove links to infringing content when appropriate." },
  { n: 4, title: "Notify", body: "We notify you of the action taken on your request." },
];

const REQUIREMENTS = [
  { title: "Description of Copyrighted Work", body: "A description of the copyrighted work that you claim is being infringed." },
  { title: "Location of Infringing Material", body: "The URL(s) or location of the material you claim is infringing, with enough detail to locate it." },
  { title: "Your Contact Information", body: "Your name, title (if acting as an agent), address, telephone number, and email address." },
  { title: "Good Faith Statement", body: "\"I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law.\"" },
  { title: "Accuracy Statement", body: "\"The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner.\"" },
  { title: "Legal Accountability Statement", body: "\"I understand that I am subject to legal action upon submitting a DMCA request without solid proof.\"" },
  { title: "Signature", body: "An electronic or physical signature of the copyright owner or an authorized agent." },
];

export default function DmcaPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-8">
      <header className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-white">DMCA Policy</h1>
        <p className="mt-3 text-sm font-medium tracking-wide text-[var(--fg-muted)]">Copyright Takedown Requests 🛡️</p>
      </header>

      <section className="watchflow-card mb-12 p-8 md:p-10 rounded-[24px]">
        <h2 className="mb-4 text-xl font-extrabold text-white tracking-tight">DMCA Overview</h2>
        <p className="mb-4 text-sm md:text-base leading-relaxed text-[var(--fg-muted)]">
          We take intellectual property rights seriously and comply with the Digital Millennium Copyright Act (DMCA).
          If you believe content linked from our site infringes your copyright, follow the procedure below.
        </p>
        <p className="text-sm md:text-base leading-relaxed text-[var(--fg-muted)]">
          <strong className="text-[var(--fg)]">Please Note:</strong> WatchFlow is a directory service that provides links
          to third-party sites. We do not host, store, or control any content.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-extrabold text-white tracking-tight">How We Handle DMCA Requests</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="watchflow-card p-6 text-center rounded-[20px] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:watchflow-glow">
              <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-xl font-extrabold shadow-md"
                style={{ background: "var(--accent)", color: "var(--accent-fg)", boxShadow: "0 4px 12px var(--accent-glow)" }}>
                {s.n}
              </div>
              <h3 className="font-extrabold" style={{ color: "var(--accent)" }}>{s.title}</h3>
              <p className="mt-2 text-xs font-semibold text-[var(--fg-muted)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xl font-extrabold text-white tracking-tight">DMCA Request Requirements</h2>
        <div className="watchflow-card divide-y p-3 rounded-[24px]" style={{ borderColor: "var(--border)" }}>
          {REQUIREMENTS.map((r) => (
            <div key={r.title} className="flex items-start gap-4.5 p-5" style={{ borderColor: "var(--border)" }}>
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--accent)]" size={18} />
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-[var(--fg-muted)]">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="watchflow-card p-8 md:p-10 text-center rounded-[24px]">
        <h2 className="mb-2 text-lg font-bold text-white">Submit DMCA Request</h2>
        <p className="mb-6 text-[var(--fg-muted)]">Please send your DMCA takedown notice to:</p>
        <a
          href="mailto:diamondstar2200@gmail.com"
          className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-extrabold text-white cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
          style={{ background: "var(--accent)", boxShadow: "0 8px 24px var(--accent-glow)" }}
        >
          <Mail size={15} /> diamondstar2200@gmail.com
        </a>
        <p className="mt-6 text-xs italic text-[var(--fg-muted)]">
          We will promptly investigate and take appropriate action in accordance with the DMCA.
        </p>
      </section>
    </main>
  );
}
