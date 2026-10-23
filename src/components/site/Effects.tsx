import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") { if (dot.current) dot.current.dataset["visible"] = "false"; return; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = dot.current;
        if (!el) return;
        el.dataset["visible"] = "true";
        el.dataset["active"] = String(e.target instanceof Element && !!e.target.closest("a,button,select,input,textarea,article"));
        el.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      });
    };
    const hide = () => { if (dot.current) dot.current.dataset["visible"] = "false"; };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", hide); window.removeEventListener("blur", hide); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={dot} aria-hidden className="custom-cursor pointer-events-none fixed left-0 top-0 z-[100]"><span className="block size-4 rounded-full border border-primary bg-highlight/45" /></div>;
}

export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0.5);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    const update = () => {
      cancelAnimationFrame(raf);
      if (media.matches) { setP(0.5); return; }
      if (!visible) return;
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setP(Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height))));
      });
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? true; if (visible) update(); }) : null;
    if (ref.current) observer?.observe(ref.current);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); media.removeEventListener("change", update); observer?.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

export function Parallax({ children, speed = 0.12, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  return <div ref={ref} className={className}><div className="parallax-layer" style={{ transform: `translate3d(0,${(p - 0.5) * speed * -400}px,0)` }}>{children}</div></div>;
}

export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLParagraphElement>();
  const words = text.split(" ");
  const lit = Math.round(Math.min(1, Math.max(0, (p - 0.15) / 0.35)) * words.length);
  return <p ref={ref} className={className}>{words.map((w, i) => <span key={i} className="scroll-word transition-opacity duration-300" style={{ opacity: i < lit ? 1 : 0.6 }}>{w} </span>)}</p>;
}

export function ExpandingImage({ src, alt, children }: { src: string; alt: string; children?: ReactNode }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, Math.max(0, (p - 0.1) / 0.4));
  return <div ref={ref} className="expanding-image relative h-[70svh] min-h-96 max-h-[800px] overflow-hidden" style={{ clipPath: `inset(0 ${(1 - t) * 7}% round ${(1 - t) * 8}px)` }}>
    <img src={src} alt={alt} loading="lazy" decoding="async" width={1536} height={1024} className="parallax-layer absolute inset-0 size-full object-cover" style={{ transform: `scale(${1.08 - t * 0.08})` }} />
    <div className="absolute inset-x-0 bottom-0 bg-ink/80 px-6 py-8 text-highlight md:px-12">{children}</div>
  </div>;
}

export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return <div ref={ref} onPointerMove={onMove} className={`spotlight-card ${className}`}>{children}</div>;
}

export function SplitText({ text, className = "", highlight = "", delay = 0 }: { text: string; className?: string; highlight?: string; delay?: number }) {
  const words = text.split(" ");
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <h1 className={className}>
      {words.map((w, i) => {
        const isHighlight = highlight && w.toLowerCase().includes(highlight.toLowerCase());
        const style: CSSProperties = reduced ? {} : { animationDelay: `${delay + i * 80}ms` };
        return (
          <span
            key={i}
            className={`inline-block ${reduced ? "" : "animate-blur-in"} ${isHighlight ? "rounded-md bg-highlight px-2 text-highlight-foreground" : ""}`}
            style={style}
          >{w}&nbsp;</span>
        );
      })}
    </h1>
  );
}

export function TextShuffle({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
  const [display, setDisplay] = useState(text);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let frame = 0;
    const totalFrames = 18;
    const animate = () => {
      frame++;
      if (frame >= totalFrames) {
        setDisplay(text);
        return;
      }
      const progress = frame / totalFrames;
      setDisplay(text.split("").map((c, i) => {
        if (c === " ") return " ";
        if (i < progress * text.length) return c;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      raf = requestAnimationFrame(animate);
    };
    const startTimer = setTimeout(() => { raf = requestAnimationFrame(animate); }, delay);
    return () => { clearTimeout(startTimer); cancelAnimationFrame(raf); };
  }, [text, delay, reduced]);

  return <h2 className={className}>{display}</h2>;
}

export function ScrollStack({ items }: { items: { num: string; title: string; desc: string }[] }) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    return (
      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.num} className="rounded-2xl border border-border bg-card p-8">
            <p className="font-display text-5xl text-primary">{item.num}</p>
            <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div
          key={item.num}
          className="scroll-stack-item rounded-2xl border border-border bg-card p-8 shadow-[0_20px_50px_-30px_var(--ink)]"
          style={{ top: `${10 + i * 4}vh` }}
        >
          <div className="flex items-start gap-6">
            <p className="font-display text-5xl text-primary">{item.num}</p>
            <div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CountUp({ value, className = "", prefix = "" }: { value: number; className?: string; prefix?: string }) {
  const [ref, p] = useScrollProgress<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (p < 0.2) return;
    let raf = 0;
    const start = display;
    const duration = 800;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [p, value]);
  return <span ref={ref} className={className}>{prefix}{display.toLocaleString("en-IN")}</span>;
}
