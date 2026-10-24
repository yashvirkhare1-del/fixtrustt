import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Search, ArrowRight, ArrowUpRight, ShieldCheck, ReceiptText, FolderClock, CalendarCheck, ClipboardList, Wrench, CheckCircle2, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Offers } from "@/components/site/Offers";
import { Reveal } from "@/components/site/Reveal";
import { TechCard } from "@/components/site/TechCard";
import { VanGame } from "@/components/site/VanGame";
import { technicians, inr } from "@/lib/data";
import { jobEstimates, rangeTotal } from "@/lib/estimates";
import painting from "@/assets/svc-painting.jpg";
import general from "@/assets/svc-general.jpg";

const heroPhoto = "https://images.pexels.com/photos/6870326/pexels-photo-6870326.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900";

type Service = { key: string; name: string; desc: string; img: string; category?: string; q?: string };
const services: Service[] = [
  { key: "appliance", name: "Appliance Repair", desc: "Washers, fridges and microwaves diagnosed and fixed.", category: "appliance", img: "https://images.pexels.com/photos/38264271/pexels-photo-38264271.jpeg?auto=compress&cs=tinysrgb&h=500&w=800" },
  { key: "electrical", name: "Electrical Work", desc: "Wiring, switches, fans and MCB panels.", category: "electrical", img: "https://images.pexels.com/photos/27928762/pexels-photo-27928762.jpeg?auto=compress&cs=tinysrgb&h=500&w=800" },
  { key: "plumbing", name: "Plumbing", desc: "Leaks, taps, drains and flush tanks.", category: "plumbing", img: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=500&w=800" },
  { key: "carpentry", name: "Carpentry", desc: "Doors, drawers, furniture and shelving.", category: "carpentry", img: "https://images.pexels.com/photos/6790097/pexels-photo-6790097.jpeg?auto=compress&cs=tinysrgb&h=500&w=800" },
  { key: "painting", name: "Painting", desc: "Touch-ups, walls and fresh finishes.", q: "painting", img: painting },
  { key: "general", name: "General Repairs", desc: "Hinges, fittings and small fixes around the home.", img: general },
];

const steps = [
  { icon: ClipboardList, title: "Choose a Service", desc: "Pick a category and describe what needs fixing." },
  { icon: CalendarCheck, title: "Book a Professional", desc: "Compare experience and itemized estimates, then pick a time." },
  { icon: Truck, title: "Track Your Repair", desc: "See your booking status in My repairs." },
  { icon: CheckCircle2, title: "Get It Done", desc: "Parts, work and warranty saved to your repair record." },
] as const;

const benefits = [
  { icon: ReceiptText, title: "Transparent pricing", desc: "Inspection, labour and parts shown separately before any work begins." },
  { icon: ShieldCheck, title: "Visible experience", desc: "Profiles show skills, years of work and completed sample jobs." },
  { icon: FolderClock, title: "Lasting records", desc: "Every repair, part and warranty stays in your home's history." },
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

function Index() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhySection />
      <StepsSection />
      <section aria-labelledby="game-heading" className="mx-auto mt-28 max-w-7xl px-6">
        <div className="grid-pattern overflow-hidden rounded-3xl bg-feature p-6 text-feature-foreground md:p-12">
          <Reveal><p className="text-sm font-semibold uppercase text-highlight">Mini-game</p><h2 id="game-heading" className="mt-3 font-display text-5xl uppercase leading-none md:text-6xl">Guide the van to the house!</h2>
          <p className="mb-8 mt-3 max-w-lg text-sm text-feature-muted">Use your arrow keys or the buttons. Dead ends included.</p></Reveal>
          <VanGame />
        </div>
      </section>
      <EstimatorSection />
      <div className="mx-auto mt-28 max-w-7xl px-6"><div className="rounded-3xl bg-feature pb-16 text-feature-foreground [&_.text-muted-foreground]:text-feature-muted [&_section]:pt-16"><Offers /></div></div>
      <section className="mx-auto max-w-7xl px-6 pt-28" aria-labelledby="pros-heading">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div><p className="text-sm font-semibold uppercase text-primary">Professionals</p><h2 id="pros-heading" className="mt-3 font-display text-5xl uppercase leading-none md:text-6xl">Meet sample pros</h2></div>
          <Button asChild variant="outline" className="rounded-full"><Link to="/technicians">View all <ArrowRight /></Link></Button>
        </Reveal>
        <p className="mt-3 text-sm text-muted-foreground">Sample profiles for this prototype. Names, reviews and prices are illustrative.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.slice(0, 3).map((t, i) => <Reveal key={t.id} delay={i * 80}><TechCard t={t} /></Reveal>)}
        </div>
      </section>
    </>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const match = useMemo(() => { const v = q.trim().toLowerCase(); return v ? services.filter((s) => s.name.toLowerCase().includes(v) || s.desc.toLowerCase().includes(v)) : []; }, [q]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const hit = match[0];
    navigate({ to: "/technicians", search: hit?.category ? { category: hit.category } : { q: q.trim().slice(0, 80) || undefined } });
  };
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2 lg:pt-16">
      <div className="animate-rise">
        <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase"><span className="size-2 rounded-full bg-highlight" /> Home repairs, transparently</p>
        <h1 className="mt-6 font-display text-6xl font-black uppercase leading-[0.9] md:text-8xl">Reliable home repairs. <span className="rounded-md bg-highlight px-2 text-highlight-foreground">Made simple.</span></h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">Find experienced local pros, see itemized estimates up front, and keep a record of every fix.</p>
        <form onSubmit={submit} className="relative mt-8 flex max-w-lg gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm">
          <label htmlFor="svc-search" className="sr-only">Search services</label>
          <Search className="ml-3 size-5 shrink-0 self-center text-muted-foreground" />
          <input id="svc-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try plumbing, fan, painting…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <Button type="submit" className="rounded-full bg-ink px-5 text-highlight hover:bg-ink/90">Search</Button>
          {match.length > 0 && (
            <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg">
              {match.map((s) => <li key={s.key}><Link to="/technicians" search={s.category ? { category: s.category } : s.q ? { q: s.q } : {}} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-accent">{s.name} <ArrowUpRight className="size-4" /></Link></li>)}
            </ul>
          )}
        </form>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Button asChild size="lg" className="rounded-full bg-highlight px-7 text-highlight-foreground hover:bg-highlight/85 active:scale-95"><Link to="/technicians">Book a repair <ArrowRight /></Link></Button>
          <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5"><ReceiptText className="size-4 text-primary" /> Itemized estimates</li>
            <li className="flex items-center gap-1.5"><FolderClock className="size-4 text-primary" /> Repair records</li>
          </ul>
        </div>
      </div>
      <div className="relative">
        <svg aria-hidden className="pointer-events-none absolute -inset-4 size-[calc(100%+2rem)] text-primary" fill="none"><rect x="2" y="2" width="99%" height="99%" rx="28" stroke="currentColor" strokeWidth="1.5" className="hero-outline" /></svg>
        <div className="overflow-hidden rounded-3xl"><img src={heroPhoto} alt="A repair technician at work in a home" width={900} height={1200} className="hero-photo aspect-[4/5] w-full object-cover" /></div>
        <div className="absolute -left-4 top-10 rounded-2xl border border-border bg-card p-4 shadow-lg md:-left-10">
          <p className="text-xs text-muted-foreground">Sample booking</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold"><span className="size-2 animate-pulse rounded-full bg-highlight" /> Pro on the way</p>
        </div>
        <div className="absolute -right-3 bottom-10 rounded-2xl bg-ink p-4 text-highlight shadow-lg md:-right-8">
          <p className="text-xs opacity-80">Estimate shown up front</p><p className="mt-1 font-display text-3xl">₹748–1,449</p>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 pt-20" aria-labelledby="services-heading">
      <Reveal><p className="text-sm font-semibold uppercase text-primary">Services</p><h2 id="services-heading" className="mt-3 font-display text-5xl uppercase leading-none md:text-6xl">What needs fixing?</h2></Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.key} delay={i * 60}>
            <Link to="/technicians" search={s.category ? { category: s.category } : s.q ? { q: s.q } : {}} onFocus={() => setSelected(s.key)} onMouseEnter={() => setSelected(s.key)}
              className={`svc-card group block overflow-hidden rounded-2xl border bg-card ${selected === s.key ? "border-primary" : "border-border"}`}>
              <div className="overflow-hidden"><img src={s.img} alt="" loading="lazy" width={800} height={500} className="h-44 w-full object-cover" /></div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div><h3 className="text-lg font-semibold">{s.name}</h3><p className="mt-1 text-sm text-muted-foreground">{s.desc}</p></div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border transition-colors group-hover:bg-highlight group-hover:text-highlight-foreground"><ArrowUpRight className="size-4" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  const status = ["Booked", "On the way", "Repairing", "Done"];
  return (
    <section className="mt-28 bg-feature text-feature-foreground" aria-labelledby="why-heading">
      <div className="grid-pattern"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal><p className="text-sm font-semibold uppercase text-highlight">Why FixTrust</p><h2 id="why-heading" className="mt-3 font-display text-5xl uppercase leading-none md:text-7xl">Smarter repairs. Better living.</h2></Reveal>
          <div className="mt-10 space-y-6">
            {benefits.map(({ icon: I, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}><div className="flex gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-highlight text-highlight-foreground"><I className="size-5" /></span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-feature-muted">{desc}</p></div></div></Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <div className="rounded-3xl border border-feature-foreground/15 bg-feature-foreground/5 p-6">
            <svg viewBox="0 0 400 240" className="w-full" role="img" aria-label="Illustration of a repair route through a neighbourhood">
              {[[30,30],[150,30],[270,30],[30,140],[270,140],[150,140]].map(([x,y],i) => <rect key={i} x={x} y={y} width="90" height="70" rx="10" fill="currentColor" opacity=".08" />)}
              <path d="M20 225 H140 V120 H260 V20 H380" stroke="var(--highlight)" strokeWidth="4" fill="none" strokeLinecap="round" className="route-path" />
              <circle cx="20" cy="225" r="8" fill="var(--highlight)" />
              <g transform="translate(366 6)"><rect width="28" height="28" rx="6" fill="var(--highlight)" /><path d="M7 18 L14 10 L21 18 V22 H7Z" fill="var(--highlight-foreground)" /></g>
            </svg>
            <ol className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
              {status.map((s, i) => <li key={s}><div className={`h-1.5 rounded-full ${i < 2 ? "bg-highlight" : "bg-feature-foreground/15"}`} /><p className={`mt-2 ${i < 2 ? "" : "text-feature-muted"}`}>{s}</p></li>)}
            </ol>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-feature-muted"><MapPin className="size-3.5" /> Illustration of how repair status is shown.</p>
          </div>
        </Reveal>
      </div></div>
    </section>
  );
}

function StepsSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28" aria-labelledby="steps-heading">
      <Reveal><p className="text-sm font-semibold uppercase text-primary">How it works</p><h2 id="steps-heading" className="mt-3 font-display text-5xl uppercase leading-none md:text-6xl">Four simple steps</h2></Reveal>
      <ol className="relative mt-12 grid gap-4 md:grid-cols-4">
        <span aria-hidden className="absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] bg-border md:block" />
        {steps.map(({ icon: I, title, desc }, i) => (
          <li key={title} className="relative">
            <button type="button" data-active={active === i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
              className="step-card w-full rounded-2xl border border-border bg-card p-6 text-left transition-colors">
              <span className="step-num flex size-12 items-center justify-center rounded-full border border-border bg-background font-display text-xl transition-colors">{i + 1}</span>
              <I className="mt-5 size-5 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EstimatorSection() {
  const cats = Object.keys(jobEstimates);
  const [cat, setCat] = useState<string>(cats[0] ?? "");
  const jobs = jobEstimates[cat] ?? [];
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [parts, setParts] = useState(true);
  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];
  const total = job ? rangeTotal(job, parts) : null;
  const sel = "mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm";
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28" aria-labelledby="est-heading">
      <div className="grid gap-10 rounded-3xl border border-border bg-muted/50 p-6 md:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Cost estimator</p>
          <h2 id="est-heading" className="mt-3 font-display text-5xl uppercase leading-none md:text-6xl">Know the cost first</h2>
          <div className="mt-8 space-y-5">
            <label className="block text-sm font-medium">Service
              <select className={sel} value={cat} onChange={(e) => { setCat(e.target.value); setJobId(jobEstimates[e.target.value]?.[0]?.id ?? ""); }}>
                {cats.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Issue
              <select className={sel} value={job?.id} onChange={(e) => setJobId(e.target.value)}>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={parts} onChange={(e) => setParts(e.target.checked)} className="size-4 accent-primary" /> Include likely parts</label>
          </div>
        </div>
        {job && total && (
          <div key={job.id + parts} className="animate-rise self-center rounded-2xl bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Estimated range</p>
            <p className="mt-1 font-display text-5xl">{inr(total[0])}–{inr(total[1]).replace("₹", "")}</p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Inspection</dt><dd>{inr(job.inspection)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Labour</dt><dd>{inr(job.labour[0])}–{inr(job.labour[1])}</dd></div>
              {parts && <div className="flex justify-between"><dt className="text-muted-foreground">Parts ({job.partsNote})</dt><dd>{inr(job.parts[0])}–{inr(job.parts[1])}</dd></div>}
            </dl>
            <p className="mt-5 text-xs text-muted-foreground">Illustrative estimate. Final price is confirmed after inspection.</p>
            <Button asChild variant="outline" className="mt-5 w-full rounded-full"><Link to="/estimate">Open full estimator <Wrench /></Link></Button>
          </div>
        )}
      </div>
    </section>
  );
}
