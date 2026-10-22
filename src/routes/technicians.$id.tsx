import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star, ShieldCheck, Briefcase, ArrowLeft } from "lucide-react";
import { categoryName, estimateTotal, getTech, inr } from "@/lib/data";

export const Route = createFileRoute("/technicians/$id")({
  loader: ({ params }) => {
    const t = getTech(params.id);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${categoryName(loaderData.category)} · FixTrust` },
          { name: "description", content: loaderData.bio },
          { property: "og:title", content: `${loaderData.name} on FixTrust` },
          { property: "og:description", content: loaderData.bio },
        ]
      : [{ title: "Professional not found — FixTrust" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Professional not found</h1>
      <Link to="/technicians" className="mt-6 inline-block text-primary">Back to search</Link>
    </div>
  ),
  component: Page,
});

function Page() {
  const t = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-6xl px-6 pt-10">
      <Link to="/technicians" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />All professionals</Link>
      <div className="mt-8 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div className="animate-rise">
          <div className="flex items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-full bg-accent text-2xl font-medium text-accent-foreground">{t.initials}</div>
            <div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">Illustrative sample profile</span>
              <h1 className="mt-2 font-display text-5xl">{t.name}</h1>
              <p className="text-muted-foreground">{categoryName(t.category)} · {t.area}</p>
            </div>
          </div>
          <p className="mt-8 max-w-xl text-lg leading-relaxed">{t.bio}</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { I: Star, v: `${t.rating}`, l: `${t.reviews} reviews` },
              { I: Briefcase, v: `${t.years} yrs`, l: "experience" },
              { I: ShieldCheck, v: `${t.jobs}`, l: "jobs (sample)" },
            ].map(({ I, v, l }) => (
              <div key={l} className="rounded-2xl border border-border p-5">
                <I className="size-5 text-primary" />
                <p className="mt-3 text-2xl font-semibold">{v}</p>
                <p className="text-sm text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-12 text-lg font-semibold">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">{t.skills.map((s) => <span key={s} className="rounded-full border border-border px-3 py-1.5 text-sm">{s}</span>)}</div>
          <h2 className="mt-12 text-lg font-semibold">Reviews</h2>
          {t.testimonials.map((r) => (
            <blockquote key={r.text} className="mt-3 rounded-2xl bg-muted p-6">
              <p className="font-display text-2xl">“{r.text}”</p>
              <footer className="mt-2 text-sm text-muted-foreground">{r.who}</footer>
            </blockquote>
          ))}
        </div>

        <aside className="h-fit animate-rise rounded-2xl border border-border bg-card p-7 md:sticky md:top-24" style={{ animationDelay: "150ms" }}>
          <p className="text-sm text-muted-foreground">Sample itemized estimate</p>
          <ul className="mt-5 space-y-3 text-sm">
            {t.estimate.map((l) => (
              <li key={l.item} className="flex justify-between"><span>{l.item}</span><span>{inr(l.price)}</span></li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-border pt-4 font-semibold"><span>Estimated total</span><span>{inr(estimateTotal(t))}</span></div>
          <p className="mt-3 text-xs text-muted-foreground">Final price is confirmed on inspection. Illustrative figures only.</p>
          <Link to="/book/$id" params={{ id: t.id }} className="mt-6 block rounded-full bg-primary py-3.5 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95">Book a demo visit</Link>
        </aside>
      </div>
    </div>
  );
}
