import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(false);
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    const fallback = window.setTimeout(() => { setShown(true); io.disconnect(); }, 5000);
    return () => { io.disconnect(); window.clearTimeout(fallback); };
  }, []);
  return (
    <div ref={ref} data-shown={shown} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
