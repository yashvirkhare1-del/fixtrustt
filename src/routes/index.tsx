import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search, X, WashingMachine, Zap, Droplets, Tv, Hammer, Wrench, ReceiptText, ShieldCheck, FolderClock, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import workbench from "@/assets/workbench.jpg";
import { Button } from "@/components/ui/button";
import { Offers } from "@/components/site/Offers";
import { ExpandingImage, ScrollText, SpotlightCard, SplitText, TextShuffle, ScrollStack, TiltCard } from "@/components/site/Effects";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Layout";
import { TechCard } from "@/components/site/TechCard";
import { categories, technicians } from "@/lib/data";

const heroPhoto = "https://images.pexels.com/photos/37727767/pexels-photo-37727767.jpeg?auto=compress&cs=tinysrgb&h=1400&w=1000";

const categoryPhotos: Record<string, string> = {
  appliance: "https://images.pexels.com/photos/38264271/pexels-photo-38264271.jpeg?auto=compress&cs=tinysrgb&h=500&w=800",
  electrical: "https://images.pexels.com/photos/27928762/pexels-photo-27928762.jpeg?auto=compress&cs=tinysrgb&h=500&w=800",
  plumbing: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=500&w=800",
  electronics: "https://images.pexels.com/photos/35290689/pexels-photo-35290689.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
  carpentry: "https://images.pexels.com/photos/6790097/pexels-photo-6790097.jpeg?auto=compress&cs=tinysrgb&h=500&w=800",
  installation: "https://images.pexels.com/photos/37174868/pexels-photo-37174868.jpeg?auto=compress&cs=tinysrgb&h=400&w=600",
};

const stats = [
  { num: "6", label: "Service categories" },
  { num: "3,200+", label: "Sample jobs completed" },
  { num: "4.8★", label: "Average sample rating" },
  { num: "100%", label: "Itemized estimates" },
] as const;

const featuredServices = [
  { slug: "appliance", name: "Appliance repair", blurb: "Washers, fridges, microwaves — diagnosed and fixed.", span: "md:col-span-2 md:row-span-2", img: "h-56 md:h-full" },
  { slug: "electrical", name: "Electrical work", blurb: "Wiring, switches, MCB panels.", span: "", img: "h-36" },
  { slug: "plumbing", name: "Plumbing", blurb: "Leaks, taps, drainage.", span: "", img: "h-36" },
  { slug: "carpentry", name: "Carpentry", blurb: "Doors, furniture, shelving.", span: "md:col-span-2", img: "h-36" },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FixTrust | Trusted Local Repair Services" },
      { name: "description", content: "Find local repair professionals, compare transparent estimates, book services, and keep track of your repair history." },
      { property: "og:title", content: "FixTrust | Trusted Local Repair Services" },
      { property: "og:description", content: "Find local repair professionals, compare transparent estimates, book services, and keep track of your repair history." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://fixtrustt.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://fixtrustt.lovable.app/" }],
  }),
  component: Index,
});

const icons = { appliance: WashingMachine, electrical: Zap, plumbing: Droplets, electronics: Tv, carpentry: Hammer, installation: Wrench } as const;

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");
  const search = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/technicians", search: { q: q.trim().slice(0, 80) || undefined, category: cat || undefined, area: loc.trim().slice(0, 60) || undefined } });
  };

  return (
    <>
      {/* ── Cinematic full-bleed hero ── */}
      <section className="cinema-hero">
        <img src={heroPhoto} alt="Repair technician focused on precision work" fetchPriority="high" width={1000} height={1400} className="cinema-hero-img" />
        <div className="cinema-hero-overlay" />
        <div className="absolute inset-y-0 left-0 hidden w-1/3 cinema-hero-side lg:block" />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32">
          <div className="max-w-3xl">
            <span className="hero-badge animate-rise">Home repair, reconsidered</span>
            <SplitText text="Repair professionals you can actually trust." highlight="actually" delay={300} className="mt-6 font-display text-[3.5rem] leading-[0.85] sm:text-7xl lg:text-[8rem]" />
            <p className="mt-8 max-w-xl animate-rise text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "900ms" }}>
              Compare local pros by honest prices, real experience and a record of every job done.
            </p>
            <div className="mt-9 flex animate-rise flex-wrap items-center gap-3" style={{ animationDelay: "1050ms" }}>
              <Link to="/technicians" className="btn-premium btn-premium-primary">Find a professional <ArrowRight className="size-4" /></Link>
              <Link to="/estimate" className="btn-premium border border-border bg-card/80 backdrop-blur-sm text-foreground transition hover:border-primary/40 hover:bg-muted">Estimate a repair</Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 flex animate-rise items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground" style={{ animationDelay: "1200ms" }}>
            <span className="h-px w-12 bg-muted-foreground/40" />
            Scroll to explore
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="mx-auto max-w-7xl px-6">
        <Reveal className="stats-strip rounded-2xl bg-card">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl text-primary md:text-5xl">{s.num}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Search bar ── */}
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <form onSubmit={search} className="animate-rise">
          <div className="grid gap-2 rounded-2xl border border-border bg-card p-2.5 shadow-[0_24px_60px_-30px_var(--ink)] md:grid-cols-[1fr_1fr_1.4fr_auto]">
            <input aria-label="Location" value={loc} onChange={(e) => setLoc(e.target.value)} maxLength={60} placeholder="Your area" className="rounded-xl bg-muted/40 px-4 py-3.5 text-sm outline-none transition focus:bg-muted" />
            <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl bg-muted/40 px-4 py-3.5 text-sm outline-none transition focus:bg-muted">
              <option value="">Any service</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <div className="relative">
              <input aria-label="Problem" value={q} onChange={(e) => setQ(e.target.value)} maxLength={80} placeholder="Describe the problem, e.g. washer leaking" className="w-full rounded-xl bg-muted/40 px-4 py-3.5 pr-9 text-sm outline-none transition focus:bg-muted" />
              {q && <Button variant="ghost" size="icon" type="button" aria-label="Clear" onClick={() => setQ("")} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></Button>}
            </div>
            <Button type="submit" className="h-auto rounded-xl bg-ink px-6 py-3.5 text-highlight hover:bg-ink/90"><Search className="size-4" />Search</Button>
          </div>
        </form>
      </section>

      <div className="mt-20 overflow-hidden py-5"><div className="-rotate-1"><Marquee items={["Transparent pricing", "Real experience", "Honest reviews", "Repair records"]} /></div></div>

      {/* ── Redesigned service cards — bento grid with glare hover ── */}
      <section className="mx-auto max-w-7xl px-6 pt-32">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <TextShuffle text="What needs fixing?" delay={100} className="font-display text-4xl md:text-5xl" />
            <p className="mt-3 max-w-md text-muted-foreground">Four common services. One trusted network of local professionals.</p>
          </div>
          <Link to="/technicians" className="hidden items-center gap-1 text-sm font-medium text-primary transition hover:gap-2 md:flex">View all <ArrowRight className="size-4" /></Link>
        </Reveal>
        <div className="mt-14 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {featuredServices.map((c, i) => {
            const Icon = icons[c.slug as keyof typeof icons];
            const photo = categoryPhotos[c.slug];
            return (
              <Reveal key={c.slug} delay={i * 80} className={c.span}>
                <TiltCard className="h-full rounded-[1.25rem]" max={6}>
                  <Link to="/technicians" search={{ category: c.slug }} className="svc-bento glare-hover group flex h-full flex-col">
                    <div className={`svc-bento-img relative ${c.img} w-full`}>
                      <img src={photo} alt={c.name} loading="lazy" decoding="async" className="size-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 z-[3]">
                        <div className="svc-icon !w-11 !h-11 rounded-xl">
                          <Icon className="size-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-semibold">{c.name}</p>
                        <ArrowUpRight className="size-5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.filter((c) => !featuredServices.some((f) => f.slug === c.slug)).map((c, i) => {
            const Icon = icons[c.slug as keyof typeof icons];
            return (
              <Reveal key={c.slug} delay={i * 60}>
                <SpotlightCard className="rounded-[1.25rem]">
                  <Link to="/technicians" search={{ category: c.slug }} className="svc-bento glare-hover group flex items-center gap-4 p-5">
                    <div className="svc-icon shrink-0">
                      <Icon className="size-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.blurb}</p>
                    </div>
                  </Link>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Estimate CTA ── */}
      <section aria-labelledby="estimate-heading" className="mx-auto max-w-7xl px-6 pt-36">
        <Reveal className="grid overflow-hidden rounded-3xl bg-ink text-primary-foreground md:grid-cols-[1.1fr_1fr]">
          <div className="p-10 md:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">Transparent cost estimator</p>
            <h2 id="estimate-heading" className="mt-4 font-display text-4xl leading-[0.95] md:text-6xl">Know the cost before the knock.</h2>
            <p className="mt-4 max-w-md leading-relaxed opacity-75">See indicative inspection, labour and parts costs for common jobs, shown separately so nothing is hidden.</p>
            <Link to="/estimate" className="mt-8 inline-flex items-center gap-2 rounded-full bg-highlight px-6 py-3 text-sm font-medium text-highlight-foreground transition hover:opacity-90">Estimate a repair <ArrowRight className="size-4" /></Link>
          </div>
          <div className="flex flex-col justify-center gap-3 border-t border-primary-foreground/10 p-10 md:border-l md:border-t-0 md:p-14">
            <p className="text-sm opacity-70">Example: leaking tap</p>
            {[["Inspection visit", "₹199"], ["Labour", "₹200 – ₹350"], ["Parts", "₹250 – ₹900"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-primary-foreground/10 pb-3 text-sm"><span className="opacity-80">{k}</span><span>{v}</span></div>
            ))}
            <div className="flex items-end justify-between pt-1"><span className="text-sm opacity-80">Estimated range</span><span className="font-display text-3xl text-highlight">₹649 – ₹1,449</span></div>
            <p className="text-xs opacity-60">Sample figures. Not a guaranteed final price.</p>
          </div>
        </Reveal>
      </section>

      <Offers />

      {/* ── Featured professionals ── */}
      <section className="mx-auto max-w-7xl px-6 pt-36">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">Featured professionals</h2>
            <p className="mt-3 text-sm text-muted-foreground">Illustrative sample profiles for this prototype.</p>
          </div>
          <Link to="/technicians" className="hidden items-center gap-1 text-sm font-medium text-primary transition hover:gap-2 md:flex">View all <ArrowRight className="size-4" /></Link>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {technicians.slice(0, 3).map((t, i) => <Reveal key={t.id} delay={i * 90}><TechCard t={t} /></Reveal>)}
        </div>
      </section>

      {/* ── How it works (Scroll Stack) ── */}
      <section className="mx-auto max-w-7xl px-6 pt-36">
        <Reveal>
          <TextShuffle text="Built on transparency, not promises." delay={100} className="max-w-2xl font-display text-4xl md:text-5xl" />
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <ScrollStack items={[
              { num: "01", title: "Describe the problem", desc: "Tell us what's broken. The more detail you give, the better the pro can prepare." },
              { num: "02", title: "Compare transparent estimates", desc: "See inspection charges, labour and parts separately. No hidden costs, ever." },
              { num: "03", title: "Book a demo visit", desc: "Pick a time that works. A simulated confirmation is saved to this browser." },
              { num: "04", title: "Keep a repair record", desc: "Every job, part and warranty is stored in your home's repair history." },
            ]} />
          </div>
          <div className="space-y-6">
            {[
              { I: ReceiptText, t: "Itemized estimates", d: "See visit charges, parts and labour before any work begins." },
              { I: ShieldCheck, t: "Real accountability", d: "Reviews tied to completed jobs and a visible service history." },
              { I: FolderClock, t: "Lasting repair records", d: "Every repair, part and warranty saved to your home's history." },
            ].map(({ I, t, d }, i) => (
              <Reveal key={t} delay={i * 90}>
                <div className="border-glow rounded-2xl border border-border bg-card p-7">
                  <I className="size-6 text-primary" />
                  <h3 className="mt-5 text-xl font-semibold">{t}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scroll Expand image ── */}
      <section className="pt-32" aria-label="Trustworthy repairs">
        <ExpandingImage src={workbench} alt="A technician's hands removing a tiny component from a circuit board with soldering tweezers">
          <h2 className="font-display text-4xl md:text-6xl">Care in every repair.</h2>
          <ScrollText text="The right hands. The full picture. A repair you can understand." className="mt-3 max-w-2xl text-lg text-primary-foreground" />
        </ExpandingImage>
      </section>

      {/* ── Closing CTA ── */}
      <section className="mx-auto max-w-7xl px-6 pt-36">
        <Reveal className="glare-hover bg-ink px-8 py-24 text-center text-highlight md:py-32">
          <Sparkles className="mx-auto size-8 text-highlight/60" />
          <h2 className="mt-6 font-display text-6xl md:text-8xl">Fix it once. Fix it right.</h2>
          <p className="mx-auto mt-4 max-w-md opacity-80">See how FixTrust works, or start comparing professionals now.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/technicians" className="btn-premium bg-highlight text-highlight-foreground transition hover:opacity-90">Find a pro</Link>
            <Link to="/how-it-works" className="btn-premium border border-highlight/40 text-highlight transition hover:bg-highlight/10">How it works</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
