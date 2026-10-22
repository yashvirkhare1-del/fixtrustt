import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { inr, repairs } from "@/lib/data";

export const Route = createFileRoute("/my-repairs")({
  head: () => ({
    meta: [
      { title: "My repairs — FixTrust" },
      { name: "description", content: "An illustrative dashboard of appliance and repair records." },
      { property: "og:title", content: "My repairs — FixTrust" },
      { property: "og:description", content: "Every repair, part and warranty in one place." },
    ],
  }),
  component: Page,
});

function Page() {
  const spent = repairs.filter((r) => r.status === "Completed").reduce((s, r) => s + r.cost, 0);
  return (
    <div className="mx-auto max-w-6xl px-6 pt-12">
      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Illustrative sample data</span>
      <h1 className="mt-4 animate-rise font-display text-5xl md:text-6xl">My repairs</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[["Appliances tracked", String(repairs.length)], ["Spent this year", inr(spent)], ["Upcoming", String(repairs.filter((r) => r.status === "Scheduled").length)]].map(([l, v], i) => (
          <Reveal key={l} delay={i * 80} className="rounded-2xl border border-border p-6">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-2 text-3xl font-semibold">{v}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-12 space-y-4">
        {repairs.map((r, i) => (
          <Reveal key={r.appliance} delay={i * 80} className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center">
            <div>
              <p className="font-semibold">{r.appliance}</p>
              <p className="text-sm text-muted-foreground">{r.brand}</p>
            </div>
            <div className="text-sm"><p>{r.work}</p><p className="text-muted-foreground">{r.tech} · {r.date}</p></div>
            <div className="text-sm"><p>{inr(r.cost)}</p><p className="text-muted-foreground">Warranty: {r.warranty}</p></div>
            <span className={`w-fit rounded-full px-3 py-1 text-xs ${r.status === "Completed" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
