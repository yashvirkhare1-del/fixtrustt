import { useEffect, useRef, useState, type ReactNode } from "react";

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
