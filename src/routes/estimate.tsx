import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Info } from "lucide-react";
import { categories, inr } from "@/lib/data";
import { jobEstimates, rangeTotal, type Range } from "@/lib/estimates";

export const Route = createFileRoute("/estimate")({
  validateSearch: z.object({ category: z.string().max(30).optional() }),
  head: () => ({
    meta: [
      { title: "Repair cost estimator — FixTrust" },
      { name: "description", content: "See indicative inspection, labour and parts costs for common home repairs before you book." },
      { property: "og:title", content: "Repair cost estimator — FixTrust" },
      { property: "og:description", content: "Indicative inspection, labour and parts costs, shown separately." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const fmt = ([a, b]: Range) => (a === b ? inr(a) : `${inr(a)} – ${inr(b)}`);

function Page() {
  const initial = Route.useSearch().category;
  const [cat, setCat] = useState(initial && jobEstimates[initial] ? initial : "appliance");
  const jobs = jobEstimates[cat] ?? [];
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [includeParts, setIncludeParts] = useState(true);
  const job = jobs.find((j) => j.id === jobId) ?? jobs[0];

  const pickCategory = (slug: string) => { setCat(slug); setJobId(jobEstimates[slug]?.[0]?.id ?? ""); };

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12">
      <p className="animate-rise text-xs font-semibold uppercase tracking-[0.2em] text-primary">Transparent cost estimator</p>
      <h1 className="mt-3 max-w-3xl animate-rise font-display text-5xl leading-[0.95] md:text-7xl">Know the cost before the knock.</h1>
      <p className="mt-4 max-w-xl animate-rise text-muted-foreground" style={{ animationDelay: "100ms" }}>Indicative ranges for common jobs, with inspection, labour and parts shown separately.</p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="min-w-0 space-y-8">
          <fieldset>
            <legend className="text-sm font-medium">1. Service</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.filter((c) => jobEstimates[c.slug]).map((c) => (
                <button type="button" key={c.slug} aria-pressed={cat === c.slug} onClick={() => pickCategory(c.slug)} className={`rounded-full border px-4 py-2 text-sm transition ${cat === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`}>{c.name}</button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium">2. Problem</legend>
            <div className="mt-3 grid gap-2">
              {jobs.map((j) => (
                <button type="button" key={j.id} aria-pressed={job?.id === j.id} onClick={() => setJobId(j.id)} className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left text-sm transition ${job?.id === j.id ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card hover:border-primary/40"}`}>
                  <span>{j.name}</span><span className="shrink-0 text-xs text-muted-foreground">from {inr(rangeTotal(j, false)[0])}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5 text-sm">
            <span>3. Include likely replacement parts</span>
            <input type="checkbox" checked={includeParts} onChange={(e) => setIncludeParts(e.target.checked)} className="size-4 accent-[var(--primary)]" />
          </label>
        </div>

        {job && (
          <aside aria-live="polite" className="h-fit rounded-3xl bg-ink p-7 text-primary-foreground shadow-[0_30px_60px_-30px_var(--ink)] lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">Indicative estimate</p>
            <h2 className="mt-2 text-3xl">{job.name}</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4"><dt><span className="block">Inspection visit</span><span className="text-xs opacity-60">Fixed, paid on visit</span></dt><dd>{inr(job.inspection)}</dd></div>
              <div className="flex justify-between gap-4"><dt><span className="block">Labour</span><span className="text-xs opacity-60">Depends on time needed</span></dt><dd>{fmt(job.labour)}</dd></div>
              <div className={`flex justify-between gap-4 transition-opacity ${includeParts ? "" : "opacity-40"}`}><dt><span className="block">Parts</span><span className="text-xs opacity-60">{job.partsNote}</span></dt><dd>{includeParts ? fmt(job.parts) : "Not included"}</dd></div>
            </dl>
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-primary-foreground/15 pt-5">
              <span className="text-sm opacity-80">Estimated range</span>
              <span className="font-display text-4xl text-highlight">{fmt(rangeTotal(job, includeParts))}</span>
            </div>
            <p className="mt-5 flex gap-2 rounded-xl bg-primary-foreground/5 p-3 text-xs leading-relaxed opacity-80"><Info className="mt-0.5 size-4 shrink-0" />Sample figures for this prototype. Estimates are not guaranteed final prices — the actual cost is confirmed after inspection.</p>
            <Link to="/technicians" search={{ category: cat }} className="mt-6 flex items-center justify-center gap-2 rounded-full bg-highlight py-3.5 text-sm font-medium text-highlight-foreground transition hover:opacity-90">Find a professional <ArrowRight className="size-4" /></Link>
          </aside>
        )}
      </div>
    </div>
  );
}
