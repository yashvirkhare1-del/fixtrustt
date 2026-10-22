import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How FixTrust works" },
      { name: "description", content: "Search, compare, book and keep a record — the FixTrust journey in four steps." },
      { property: "og:title", content: "How FixTrust works" },
      { property: "og:description", content: "From problem to lasting repair record in four steps." },
    ],
  }),
  component: Page,
});

const steps = [
  { t: "Describe the problem", d: "Tell us what's broken and where you are. We match the right category of professional." },
  { t: "Compare with clarity", d: "Review skills, experience, reviews and visit charges side by side — no hidden fees." },
  { t: "Book and track", d: "Pick a slot, see an itemized estimate, and follow the appointment from booking to finish." },
  { t: "Keep the record", d: "Every repair, part and warranty is saved to your home's history for next time." },
];

function Page() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      setP(Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height)));
    };
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-12">
      <h1 className="animate-rise font-display text-5xl md:text-6xl">How it works</h1>
      <p className="mt-4 animate-rise text-lg text-muted-foreground" style={{ animationDelay: "100ms" }}>Four simple steps, designed around trust.</p>
      <div ref={ref} className="relative mt-20 pl-12">
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-border" />
        <div className="absolute left-[11px] top-0 w-px bg-primary" style={{ height: `${p * 100}%` }} />
        <div className="space-y-24">
          {steps.map((s, i) => (
            <Reveal key={s.t} className="relative">
              <span className="absolute -left-12 top-1 flex size-6 items-center justify-center rounded-full border border-primary bg-background text-xs text-primary">{i + 1}</span>
              <h2 className="font-display text-3xl">{s.t}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="mt-24 text-center">
        <Link to="/technicians" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">Find a professional</Link>
      </Reveal>
    </div>
  );
}
