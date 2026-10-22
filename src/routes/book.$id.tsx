import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { categoryName, getTech, inr } from "@/lib/data";

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
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

const steps = ["Problem", "Schedule", "Details", "Confirm"];
const slots = ["9:00 – 11:00", "11:00 – 13:00", "14:00 – 16:00", "16:00 – 18:00"];
const details = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,15}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your area or address").max(200),
});

function Page() {
  const t = Route.useLoaderData();
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const next = () => {
    const e: Record<string, string> = {};
    if (step === 0 && problem.trim().length < 5) e.problem = "Describe the problem in a few words";
    if (step === 1) { if (!date) e.date = "Pick a date"; if (!slot) e.slot = "Pick a time slot"; }
    if (step === 2) {
      const r = details.safeParse(form);
      if (!r.success) r.error.issues.forEach((i) => { e[String(i.path[0])] = i.message; });
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step === 3) {
      setLoading(true);
      setTimeout(() => { setLoading(false); setDone(true); }, 1100);
      return;
    }
    setStep(step + 1);
  };

  const field = "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/15";
  const err = (k: string) => errors[k] && <p className="mt-1.5 text-sm text-destructive">{errors[k]}</p>;
  const today = new Date().toISOString().slice(0, 10);

  if (done) {
    return (
      <div className="mx-auto max-w-lg animate-rise px-6 py-28 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-8" /></div>
        <h1 className="mt-8 font-display text-5xl">Demo booking confirmed</h1>
        <p className="mt-4 text-muted-foreground">This is a simulated booking. No real appointment was made with {t.name}, and no payment was taken.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/my-repairs" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">View my repairs</Link>
          <Link to="/" className="rounded-full border border-border px-6 py-3 text-sm">Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-12">
      <p className="text-sm text-muted-foreground">Demo booking · {t.name} · {categoryName(t.category)}</p>
      <div className="mt-6 flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className="h-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-500" style={{ width: i <= step ? "100%" : "0%" }} /></div>
            <p className={`mt-2 text-xs ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
          </div>
        ))}
      </div>

      <div key={step} className="mt-12 animate-rise">
        {step === 0 && (
          <div>
            <h1 className="font-display text-4xl">What's the problem?</h1>
            <textarea aria-label="Problem" value={problem} maxLength={500} onChange={(e) => setProblem(e.target.value)} rows={5} placeholder="e.g. Washing machine isn't draining after the cycle" className={`${field} mt-6`} />
            {err("problem")}
          </div>
        )}
        {step === 1 && (
          <div>
            <h1 className="font-display text-4xl">When suits you?</h1>
            <input aria-label="Date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={`${field} mt-6`} />
            {err("date")}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {slots.map((s) => <button key={s} onClick={() => setSlot(s)} className={`rounded-xl border px-4 py-3 text-sm transition ${slot === s ? "border-primary bg-accent text-accent-foreground" : "border-border hover:border-primary/40"}`}>{s}</button>)}
            </div>
            {err("slot")}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h1 className="font-display text-4xl">Your details</h1>
            <p className="text-sm text-muted-foreground">Demo only — please don't enter real personal information.</p>
            {(["name", "phone", "address"] as const).map((k) => (
              <div key={k}>
                <label htmlFor={k} className="text-sm capitalize">{k}</label>
                <input id={k} value={form[k]} maxLength={k === "address" ? 200 : 80} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className={`${field} mt-1.5`} />
                {err(k)}
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div>
            <h1 className="font-display text-4xl">Review & confirm</h1>
            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border text-sm">
              {[["Professional", t.name], ["Problem", problem], ["When", `${date} · ${slot}`], ["Name", form.name], ["Visit charge", inr(t.visitCharge)]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 p-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>
              ))}
            </dl>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-between">
        <button disabled={step === 0} onClick={() => setStep(step - 1)} className="rounded-full px-5 py-3 text-sm text-muted-foreground disabled:opacity-0">Back</button>
        <button onClick={next} disabled={loading} className="flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95">
          {loading && <Loader2 className="size-4 animate-spin" />}{step === 3 ? "Confirm demo booking" : "Continue"}
        </button>
      </div>
    </div>
  );
}
