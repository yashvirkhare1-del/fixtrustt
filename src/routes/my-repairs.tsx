import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, ClipboardList, History, Wrench } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { categoryName, inr, repairs } from "@/lib/data";
import { cancelBooking, clearBookings, useBookings, type DemoBooking } from "@/lib/bookings";

export const Route = createFileRoute("/my-repairs")({
  head: () => ({
    meta: [
      { title: "My repairs — FixTrust" },
      { name: "description", content: "A demo dashboard of upcoming appointments and repair history." },
      { property: "og:title", content: "My repairs — FixTrust" },
      { property: "og:description", content: "Every repair, part and warranty in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const prettyDate = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const tabs = [{ id: "upcoming", label: "Upcoming", I: CalendarClock }, { id: "history", label: "History", I: History }] as const;

function Page() {
  const bookings = useBookings();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("upcoming");
  const [open, setOpen] = useState<string | null>(null);
  const scheduled = bookings.filter((b) => b.status === "Scheduled");
  const cancelled = bookings.filter((b) => b.status === "Cancelled");
  const completed = repairs.filter((r) => r.status === "Completed");
  const spent = completed.reduce((s, r) => s + r.cost, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Demo dashboard · stored in this browser</span>
          <h1 className="mt-4 animate-rise font-display text-5xl md:text-6xl">My repairs</h1>
        </div>
        <Link to="/technicians" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">Book a repair</Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[["Upcoming visits", String(scheduled.length)], ["Completed (sample)", String(completed.length)], ["Spent (sample)", inr(spent)]].map(([l, v], i) => (
          <Reveal key={l} delay={i * 80} className="rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-2 font-display text-4xl">{v}</p>
          </Reveal>
        ))}
      </div>

      <div role="tablist" aria-label="Repairs" className="mt-12 inline-flex rounded-full border border-border bg-card p-1">
        {tabs.map(({ id, label, I }) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm transition ${tab === id ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <I className="size-4" />{label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-6 space-y-4">
        {tab === "upcoming" && (scheduled.length === 0 ? (
          <Empty icon={ClipboardList} title="No upcoming visits" body="Demo bookings you make will appear here with their confirmation reference." cta={<Link to="/technicians" className="rounded-full bg-highlight px-6 py-3 text-sm font-medium text-highlight-foreground">Find a professional</Link>} />
        ) : scheduled.map((b) => <BookingRow key={b.ref} b={b} open={open === b.ref} onToggle={() => setOpen(open === b.ref ? null : b.ref)} />))}

        {tab === "history" && (
          <>
            {cancelled.map((b) => <BookingRow key={b.ref} b={b} open={open === b.ref} onToggle={() => setOpen(open === b.ref ? null : b.ref)} />)}
            <p className="pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sample repair history</p>
            {completed.map((r) => (
              <div key={r.appliance} className="grid gap-4 rounded-2xl border border-border bg-card p-6 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Wrench className="size-5" /></div>
                  <div><p className="font-semibold">{r.appliance}</p><p className="text-sm text-muted-foreground">{r.brand}</p></div>
                </div>
                <div className="text-sm"><p>{r.work}</p><p className="text-muted-foreground">{r.tech} · {r.date}</p></div>
                <div className="text-sm"><p>{inr(r.cost)}</p><p className="text-muted-foreground">Warranty: {r.warranty}</p></div>
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">Completed</span>
              </div>
            ))}
          </>
        )}
      </div>

      {bookings.length > 0 && (
        <button type="button" onClick={() => { if (window.confirm("Remove all demo bookings from this browser?")) clearBookings(); }} className="mt-8 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Clear demo bookings</button>
      )}
    </div>
  );
}

function BookingRow({ b, open, onToggle }: { b: DemoBooking; open: boolean; onToggle: () => void }) {
  const active = b.status === "Scheduled";
  return (
    <div className={`overflow-hidden rounded-2xl border bg-card transition ${active ? "border-border" : "border-dashed border-border opacity-70"}`}>
      <button type="button" aria-expanded={open} onClick={onToggle} className="grid w-full gap-4 p-6 text-left md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center">
        <div><p className="font-semibold">{b.service}</p><p className="text-sm text-muted-foreground">{b.techName} · {categoryName(b.category)}</p></div>
        <div className="text-sm"><p>{prettyDate(b.date)}</p><p className="text-muted-foreground">{b.slot}</p></div>
        <div className="text-sm"><p className="font-mono">{b.ref}</p><p className="text-muted-foreground">Visit {inr(b.visitCharge)}</p></div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs ${active ? "bg-highlight text-highlight-foreground" : "bg-muted text-muted-foreground"}`}>{active ? "Scheduled (demo)" : "Cancelled"}</span>
      </button>
      {open && (
        <div className="animate-rise border-t border-border bg-muted/50 p-6 text-sm">
          <p className="text-muted-foreground">Problem described</p>
          <p className="mt-1 break-words">{b.problem}</p>
          <p className="mt-4 text-xs text-muted-foreground">Booked {new Date(b.createdAt).toLocaleString("en-IN")} · for {b.name}</p>
          {active && <button type="button" onClick={() => cancelBooking(b.ref)} className="mt-4 rounded-full border border-destructive/40 px-4 py-2 text-sm text-destructive transition hover:bg-destructive/10">Cancel demo booking</button>}
        </div>
      )}
    </div>
  );
}

function Empty({ icon: I, title, body, cta }: { icon: typeof ClipboardList; title: string; body: string; cta: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><I className="size-6" /></div>
      <h2 className="mt-5 text-3xl">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      <div className="mt-6">{cta}</div>
    </div>
  );
}
