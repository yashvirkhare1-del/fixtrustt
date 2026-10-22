import { useEffect, useRef, useState, type ReactNode } from "react";

/** Lime cursor that trails the pointer and grows over links (desktop only). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, big = false;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      big = !!(e.target as HTMLElement).closest("a,button,select,input,textarea");
    };
    const tick = () => {
      cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%) scale(${big ? 2.6 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  if (!enabled) return null;
  return <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[60] size-4 rounded-full bg-highlight mix-blend-difference transition-[width,height,scale] duration-300" style={{ transition: "transform 0.15s ease-out" }} />;
}

/** Returns scroll progress (0→1) of an element through the viewport. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const f = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        setP(Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))));
      });
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    window.addEventListener("resize", f);
    return () => { window.removeEventListener("scroll", f); window.removeEventListener("resize", f); cancelAnimationFrame(raf); };
  }, []);
  return [ref, p] as const;
}

/** Moves children vertically at a different speed than the page. */
export function Parallax({ children, speed = 0.2, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      <div style={{ transform: `translate3d(0, ${(p - 0.5) * speed * -400}px, 0)`, willChange: "transform" }}>{children}</div>
    </div>
  );
}

/** Words light up one by one as the paragraph scrolls through view. */
export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLParagraphElement>();
  const words = text.split(" ");
  const lit = Math.round(Math.min(1, Math.max(0, (p - 0.2) / 0.45)) * words.length);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="transition-opacity duration-300" style={{ opacity: i < lit ? 1 : 0.15 }}>{w} </span>
      ))}
    </p>
  );
}

/** Full-bleed image that grows from an inset card to edge-to-edge while scrolling. */
export function ExpandingImage({ src, alt, children }: { src: string; alt: string; children?: ReactNode }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, p * 2);
  const inset = (1 - t) * 8;
  return (
    <div ref={ref} className="relative h-[90vh] overflow-hidden" style={{ clipPath: `inset(${inset}% ${inset}% round ${(1 - t) * 32}px)` }}>
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover" style={{ transform: `scale(${1.25 - t * 0.25})` }} />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="relative flex h-full items-center justify-center px-6 text-center">{children}</div>
    </div>
  );
}
