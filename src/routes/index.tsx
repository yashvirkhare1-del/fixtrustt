import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FixTrust — Repair professionals you can trust" },
      { name: "description", content: "Find local repair pros with transparent pricing, real reviews and lasting repair records." },
      { property: "og:title", content: "FixTrust — Repair professionals you can trust" },
      { property: "og:description", content: "Transparent pricing, real reviews and lasting repair records for every home repair." },
    ],
  }),
  component: Index,
});

const benefits = [
  { n: "01", t: "Transparent pricing", d: "See visit charges and itemized estimates before anyone steps through your door." },
  { n: "02", t: "Proven experience", d: "Skills, service history and customer reviews, all in one clear profile." },
  { n: "03", t: "Lasting records", d: "Every repair saved to your home's history, so nothing is ever guesswork again." },
];

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
});

function Index() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email });
    if (!r.success) return setError(r.error.issues[0]?.message ?? "Please enter a valid email");
    setError("");
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <span className="text-lg font-semibold tracking-tight">
          Fix<span className="text-primary">Trust</span>
        </span>
        <a href="#signup" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          Get early access
        </a>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pb-32 pt-24 md:pt-36">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">Home repair, reconsidered</p>
          <h1 className="max-w-3xl font-display text-5xl leading-[1.05] md:text-7xl">
            Repair professionals you can <em className="text-primary">actually</em> trust.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            FixTrust helps households choose local repair pros through honest prices, verified reviews and a record of every job done.
          </p>
          <a
            href="#signup"
            className="mt-12 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Join the waitlist
          </a>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid max-w-5xl gap-16 px-6 py-28 md:grid-cols-3 md:gap-12">
            {benefits.map((b) => (
              <div key={b.n}>
                <span className="text-sm text-primary">{b.n}</span>
                <h2 className="mt-4 font-display text-3xl">{b.t}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="signup" className="border-t border-border">
          <div className="mx-auto max-w-xl px-6 py-32 text-center">
            <h2 className="font-display text-4xl md:text-5xl">Be first to try FixTrust.</h2>
            <p className="mt-4 text-muted-foreground">One email when we launch. Nothing else.</p>
            {done ? (
              <p className="mt-10 rounded-full bg-accent px-6 py-4 text-sm font-medium text-accent-foreground" role="status">
                Thanks — you're on the list.
              </p>
            ) : (
              <form onSubmit={submit} noValidate className="mt-10">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    maxLength={255}
                    aria-invalid={!!error}
                    className="flex-1 rounded-full border border-input bg-card px-6 py-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                  <button type="submit" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                    Sign up
                  </button>
                </div>
                {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-10 text-sm text-muted-foreground">
          © 2026 FixTrust · A student concept prototype
        </div>
      </footer>
    </div>
  );
}
