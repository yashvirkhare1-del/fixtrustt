import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./Brand";
import { useSoundEnabled, toggleSound, playClick } from "@/lib/sound";
import { useTheme, toggleTheme } from "@/lib/theme";

const nav = [
  { to: "/technicians", label: "Find a pro" },
  { to: "/estimate", label: "Cost estimator" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/my-repairs", label: "My repairs" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const soundOn = useSoundEnabled();
  const theme = useTheme();
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/85 backdrop-blur-lg" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" aria-label="FixTrust home"><Brand /></Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="nav-link text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-sm text-foreground" }}>{n.label}</Link>
          ))}
          <Link to="/" hash="offers" className="nav-link text-sm text-muted-foreground transition-colors hover:text-foreground">Offers</Link>
          <div className="flex items-center gap-2">
            <button type="button" className="theme-toggle" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => toggleTheme()}>
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button type="button" className="sound-toggle" data-on={soundOn} aria-pressed={soundOn} aria-label={soundOn ? "Mute sounds" : "Enable sounds"} onClick={() => { const on = toggleSound(); if (on) playClick(); }}>
              {soundOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
              <span className="hidden lg:inline">{soundOn ? "Sound on" : "Sound off"}</span>
            </button>
          </div>
          <Button asChild className="rounded-full bg-ink px-5 text-highlight hover:bg-ink/90"><Link to="/technicians">Book a repair</Link></Button>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" className="theme-toggle" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => toggleTheme()}>
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Button variant="ghost" size="icon" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      <div id="mobile-nav" inert={!open} className={`grid overflow-hidden border-border bg-background transition-all duration-300 md:hidden ${open ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0">
          <div className="flex flex-col gap-4 px-6 pb-6">
            {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-base">{n.label}</Link>)}
            <Link to="/" hash="offers" onClick={() => setOpen(false)} className="text-base">Offers</Link>
            <div className="flex items-center gap-3">
              <button type="button" className="sound-toggle" data-on={soundOn} aria-pressed={soundOn} aria-label={soundOn ? "Mute sounds" : "Enable sounds"} onClick={() => { const on = toggleSound(); if (on) playClick(); }}>
                {soundOn ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                {soundOn ? "Sound on" : "Sound off"}
              </button>
            </div>
            <Link to="/technicians" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-highlight px-5 py-3 text-center text-sm font-medium text-highlight-foreground">Book a repair</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" aria-label="FixTrust home"><Brand /></Link>
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
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 pb-10 text-xs text-muted-foreground">
        <p>© 2026 FixTrust concept</p>
        <p>
          Photo:{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Soldering_a_0805.jpg" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">Soldering a 0805</a>{" "}
          by Aisart,{" "}
          <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">CC BY-SA 3.0</a>, resized.
        </p>
      </div>
    </footer>
  );
}

export function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || sessionStorage.getItem("ft-intro")) return;
    sessionStorage.setItem("ft-intro", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex animate-loader flex-col items-center justify-center bg-highlight text-highlight-foreground">
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
