import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search, X, WashingMachine, Zap, Droplets, Tv, Hammer, Wrench, ReceiptText, ShieldCheck, FolderClock, ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Layout";
import { TechCard } from "@/components/site/TechCard";
import { categories, technicians } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FixTrust — Repair professionals you can trust" },
      { name: "description", content: "Find local repair pros with transparent pricing, real experience, reviews and lasting repair records." },
      { property: "og:title", content: "FixTrust — Repair professionals you can trust" },
      { property: "og:description", content: "Transparent pricing, real experience and lasting repair records for every home repair." },
    ],
  }),
  component: Index,
});

const icons = { appliance: WashingMachine, electrical: Zap, plumbing: Droplets, electronics: Tv, carpentry: Hammer, installation: Wrench } as const;

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");
  const words = "Repair professionals you can actually trust.".split(" ");

  const search = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/technicians", search: { q: q.trim().slice(0, 80) || undefined, category: cat || undefined, area: loc.trim().slice(0, 60) || undefined } });
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-10 size-[28rem] animate-drift rounded-full bg-accent blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 md:grid-cols-[1.1fr_1fr] md:pt-24">
          <div>
            <p className="animate-rise text-sm font-medium uppercase tracking-[0.2em] text-primary">Home repair, reconsidered</p>
            <h1 className="mt-6 font-display text-6xl leading-[0.9] md:text-[8.5rem]">
              {words.map((w, i) => (
                <span key={i} className={`inline-block animate-rise ${w === "actually" ? "rounded-md bg-highlight px-2 text-highlight-foreground" : ""}`} style={{ animationDelay: `${150 + i * 80}ms` }}>{w}&nbsp;</span>
              ))}
            </h1>
            <p className="mt-6 max-w-lg animate-rise text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "700ms" }}>
              Compare local pros by honest prices, real experience and a record of every job done.
            </p>
          </div>
          <div className="animate-rise overflow-hidden rounded-3xl" style={{ animationDelay: "300ms" }}>
            <img src={hero} alt="Repair technician fixing a washing machine" width={1280} height={1024} className="aspect-[5/4] w-full object-cover" />
          </div>
        </div>
        <form onSubmit={search} className="relative mx-auto -mt-8 max-w-6xl animate-rise px-6" style={{ animationDelay: "850ms" }}>
          <div className="grid gap-2 rounded-2xl border border-border bg-card p-2 shadow-[0_20px_50px_-30px_var(--primary)] md:grid-cols-[1fr_1fr_1.4fr_auto]">
            <input aria-label="Location" value={loc} onChange={(e) => setLoc(e.target.value)} maxLength={60} placeholder="Your area" className="rounded-xl bg-transparent px-4 py-3 text-sm outline-none transition focus:bg-muted" />
            <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl bg-transparent px-4 py-3 text-sm outline-none transition focus:bg-muted">
              <option value="">Any service</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <div className="relative">
              <input aria-label="Problem" value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} placeholder="Describe the problem, e.g. washer leaking" className="w-full rounded-xl bg-transparent px-4 py-3 pr-9 text-sm outline-none transition focus:bg-muted" />
              {q && <button type="button" aria-label="Clear" onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></button>}
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95"><Search className="size-4" />Search</button>
          </div>
        </form>
      </section>

      <div className="mt-28 -rotate-1"><Marquee items={["Transparent pricing", "Real experience", "Honest reviews", "Repair records"]} /></div>

      <section className="mx-auto max-w-6xl px-6 pt-28">
        <Reveal><h2 className="font-display text-4xl md:text-5xl">What needs fixing?</h2></Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map((c, i) => {
            const Icon = icons[c.slug as keyof typeof icons];
            return (
              <Reveal key={c.slug} delay={i * 70}>
                <Link to="/technicians" search={{ category: c.slug }} className="lift group block rounded-2xl border border-border bg-card p-6">
                  <Icon className="size-6 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                  <p className="mt-6 font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.blurb}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-32">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">Featured professionals</h2>
            <p className="mt-2 text-sm text-muted-foreground">Illustrative sample profiles for this prototype.</p>
          </div>
          <Link to="/technicians" className="hidden items-center gap-1 text-sm text-primary md:flex">View all <ArrowRight className="size-4" /></Link>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {technicians.slice(0, 3).map((t, i) => <Reveal key={t.id} delay={i * 90}><TechCard t={t} /></Reveal>)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-32">
        <Reveal><h2 className="max-w-2xl font-display text-4xl md:text-5xl">Built on transparency, not promises.</h2></Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {[
            { I: ReceiptText, t: "Itemized estimates", d: "See visit charges, parts and labour before any work begins." },
            { I: ShieldCheck, t: "Real accountability", d: "Reviews tied to completed jobs and a visible service history." },
            { I: FolderClock, t: "Lasting repair records", d: "Every repair, part and warranty saved to your home's history." },
          ].map(({ I, t, d }, i) => (
            <Reveal key={t} delay={i * 90}>
              <I className="size-6 text-primary" />
              <h3 className="mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-32">
        <Reveal className="rounded-3xl bg-ink px-8 py-20 text-center text-highlight md:py-28">
          <h2 className="font-display text-6xl md:text-8xl">Fix it once. Fix it right.</h2>
          <p className="mx-auto mt-4 max-w-md opacity-80">See how FixTrust works, or start comparing professionals now.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/technicians" className="rounded-full bg-highlight px-6 py-3 text-sm font-medium text-highlight-foreground transition hover:opacity-90 active:scale-95">Find a pro</Link>
            <Link to="/how-it-works" className="rounded-full border border-highlight/40 px-6 py-3 text-sm font-medium transition hover:bg-highlight/10">How it works</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
