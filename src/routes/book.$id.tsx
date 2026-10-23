import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Check, Copy, Loader2 } from "lucide-react";
import { categoryName, estimateTotal, getTech, inr } from "@/lib/data";
import { addBooking, makeRef } from "@/lib/bookings";
import { playSuccess } from "@/lib/sound";

export const Route = createFileRoute("/book/$id")({
  loader: ({ params }) => {
    const t = getTech(params.id);
    if (!t) throw notFound();
    return t;
  },
  head: () => ({
    meta: [
      { title: "Book a demo visit — FixTrust" },
      { name: "description", content: "A simulated booking flow for the FixTrust prototype." },
      { property: "og:title", content: "Book a demo visit — FixTrust" },
      { property: "og:description", content: "Try the FixTrust booking experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const steps = ["Service", "Problem", "Schedule", "Details", "Confirm"];
const slots = ["9:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00", "16:00 – 18:00"];
const details = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,15}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your area or address").max(200),
});

const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const prettyDate = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function Page() {
  const t = Route.useLoaderData();
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [problem, setProblem] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [doneRef, setDoneRef] = useState("");
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const minDate = isoDate(today);
  const maxDate = isoDate(new Date(today.getTime() + 60 * 864e5));

  const next = () => {
    const e: Record<string, string> = {};
    if (step === 0 && !service) e["service"] = "Choose the service you need";
    if (step === 1 && problem.trim().length < 10) e["problem"] = "Describe the problem in at least 10 characters";
    if (step === 2) {
      if (!date) e["date"] = "Pick a date";
      else if (date < minDate || date > maxDate) e["date"] = "Choose a date within the next 60 days";
      if (!slot) e["slot"] = "Pick a time slot";
    }
    if (step === 3) {
      const r = details.safeParse(form);
      if (!r.success) r.error.issues.forEach((i) => { e[String(i.path[0])] = i.message; });
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step === 4) {
      setLoading(true);
      window.setTimeout(() => {
        const ref = makeRef();
        addBooking({ ref, techId: t.id, techName: t.name, category: t.category, service, problem: problem.trim(), date, slot, name: form.name.trim(), visitCharge: t.visitCharge, createdAt: new Date().toISOString(), status: "Scheduled" });
        setLoading(false);
        setDoneRef(ref);
        playSuccess();
        window.scrollTo({ top: 0 });
      }, 900);
      return;
    }
    setStep(step + 1);
  };

  const field = "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/15";
  const err = (k: string) => errors[k] && <p role="alert" className="mt-1.5 text-sm text-destructive">{errors[k]}</p>;
  const choice = (active: boolean) => `rounded-xl border px-4 py-3 text-left text-sm transition ${active ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card hover:border-primary/40"}`;

  if (doneRef) {
    return (
      <div className="mx-auto max-w-lg animate-rise px-6 py-24 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-highlight text-highlight-foreground"><Check className="size-8" /></div>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Demo booking saved</p>
        <h1 className="mt-3 font-display text-5xl">You&apos;re on the list</h1>
        <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4">
          <div className="text-left"><p className="text-xs text-muted-foreground">Confirmation reference</p><p className="font-mono text-xl font-semibold tracking-wider">{doneRef}</p></div>
          <button type="button" aria-label="Copy reference" onClick={() => { navigator.clipboard?.writeText(doneRef).then(() => setCopied(true)).catch(() => undefined); }} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{service} with {t.name} on {prettyDate(date)}, {slot}. This is a simulated booking stored only in this browser. No real appointment was made and no payment was taken.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/my-repairs" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">View my repairs</Link>
          <Link to="/" className="rounded-full border border-border px-6 py-3 text-sm transition hover:bg-muted">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 pt-10 lg:grid-cols-[1fr_300px]">
      <div className="min-w-0">
        <Link to="/technicians/$id" params={{ id: t.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to profile</Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Demo booking · Step {step + 1} of {steps.length}</p>
        <ol className="mt-4 flex gap-2" aria-label="Booking progress">
          {steps.map((s, i) => (
            <li key={s} className="flex-1" aria-current={i === step ? "step" : undefined}>
              <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-500" style={{ width: i <= step ? "100%" : "0%" }} /></div>
              <p className={`mt-2 hidden text-xs sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
            </li>
          ))}
        </ol>

        <div key={step} className="mt-10 animate-rise">
          {step === 0 && (
            <fieldset>
              <legend className="font-display text-4xl uppercase">Which service?</legend>
              <p className="mt-2 text-sm text-muted-foreground">{t.name} offers these {categoryName(t.category).toLowerCase()} services.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[...t.skills, "Not sure — inspection only"].map((s) => <button type="button" key={s} aria-pressed={service === s} onClick={() => setService(s)} className={choice(service === s)}>{s}</button>)}
              </div>
              {err("service")}
            </fieldset>
          )}
          {step === 1 && (
            <div>
              <h1 className="font-display text-4xl">What&apos;s the problem?</h1>
              <p className="mt-2 text-sm text-muted-foreground">A short description helps the professional bring the right parts.</p>
              <textarea aria-label="Problem" value={problem} maxLength={500} onChange={(e) => setProblem(e.target.value)} rows={5} placeholder="e.g. Washing machine isn't draining after the cycle" className={`${field} mt-6`} />
              <div className="flex justify-between">{err("problem") || <span />}<span className="mt-1.5 text-xs text-muted-foreground">{problem.length}/500</span></div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h1 className="font-display text-4xl">When suits you?</h1>
              <label htmlFor="date" className="mt-6 block text-sm">Preferred date</label>
              <input id="date" type="date" min={minDate} max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-1.5`} />
              {err("date")}
              <p className="mt-6 text-sm">Preferred time</p>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {slots.map((s) => <button type="button" key={s} aria-pressed={slot === s} onClick={() => setSlot(s)} className={choice(slot === s)}>{s}</button>)}
              </div>
              {err("slot")}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h1 className="font-display text-4xl">Your details</h1>
              <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">Demo only — please don&apos;t enter real personal information.</p>
              {(["name", "phone", "address"] as const).map((k) => (
                <div key={k}>
                  <label htmlFor={k} className="text-sm capitalize">{k === "address" ? "Area or address" : k}</label>
                  <input id={k} type={k === "phone" ? "tel" : "text"} value={form[k]} maxLength={k === "address" ? 200 : 80} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} className={`${field} mt-1.5`} />
                  {err(k)}
                </div>
              ))}
            </div>
          )}
          {step === 4 && (
            <div>
              <h1 className="font-display text-4xl">Review & confirm</h1>
              <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card text-sm">
                {[["Professional", t.name], ["Service", service], ["Problem", problem.trim()], ["When", `${prettyDate(date)} · ${slot}`], ["Name", form.name.trim()], ["Inspection visit", inr(t.visitCharge)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 p-4"><dt className="shrink-0 text-muted-foreground">{k}</dt><dd className="min-w-0 break-words text-right">{v}</dd></div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted-foreground">Confirming creates a demo record in this browser only. Nothing is sent to anyone and no payment is collected.</p>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button type="button" disabled={step === 0 || loading} onClick={() => { setErrors({}); setStep(step - 1); }} className="rounded-full px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground disabled:invisible">Back</button>
          <button type="button" onClick={next} disabled={loading} className="flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-70">
            {loading && <Loader2 className="size-4 animate-spin" />}{step === 4 ? "Confirm demo booking" : "Continue"}
          </button>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-accent font-medium text-accent-foreground">{t.initials}</div>
          <div><p className="font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{categoryName(t.category)} · {t.area}</p></div>
        </div>
        <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
          {t.estimate.map((l) => <li key={l.item} className="flex justify-between gap-4"><span className="text-muted-foreground">{l.item}</span><span>{inr(l.price)}</span></li>)}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-semibold"><span>Indicative total</span><span>{inr(estimateTotal(t))}</span></div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Sample figures. The final price is agreed after inspection.</p>
      </aside>
    </div>
  );
}
