import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/technicians", label: "Find a pro" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/my-repairs", label: "My repairs" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/85 backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight">Fix<span className="text-primary">Trust</span></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-sm text-foreground" }}>{n.label}</Link>
          ))}
          <Link to="/technicians" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95">Book a repair</Link>
        </nav>
        <button className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      <div className={`grid overflow-hidden border-border bg-background transition-all duration-300 md:hidden ${open ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0">
          <div className="flex flex-col gap-4 px-6 pb-6">
            {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-base">{n.label}</Link>)}
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-semibold">Fix<span className="text-primary">Trust</span></p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">Transparent pricing, real experience and lasting repair records for every home.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Explore</p>
          {nav.map((n) => <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-foreground">{n.label}</Link>)}
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">About this prototype</p>
          <p className="mt-2 leading-relaxed">A student concept. All professionals, reviews and prices are illustrative samples. No real bookings or payments.</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-muted-foreground">© 2026 FixTrust concept</div>
    </footer>
  );
}

export function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("ft-intro")) return;
    sessionStorage.setItem("ft-intro", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div aria-hidden className="fixed inset-0 z-50 flex animate-loader flex-col items-center justify-center bg-highlight text-highlight-foreground">
      <p className="font-display text-6xl font-black uppercase md:text-8xl">Fix<span className="opacity-60">Trust</span></p>
      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-highlight-foreground/15"><div className="h-full animate-bar bg-highlight-foreground" /></div>
      <p className="absolute bottom-10 text-sm font-semibold uppercase tracking-widest">Loading trust</p>
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-ink bg-highlight py-5 text-highlight-foreground">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((t, i) => <span key={i} className="font-display text-4xl font-black uppercase md:text-6xl">{t} <span className="opacity-40">✦</span></span>)}
      </div>
    </div>
  );
}
