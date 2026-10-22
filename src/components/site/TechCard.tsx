import { Link } from "@tanstack/react-router";
import { Star, ShieldCheck } from "lucide-react";
import { categoryName, inr, type Technician } from "@/lib/data";

export function TechCard({ t }: { t: Technician }) {
  return (
    <Link to="/technicians/$id" params={{ id: t.id }} className="lift group block rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent font-medium text-accent-foreground">{t.initials}</div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">Sample profile</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold">{t.name}</h3>
      <p className="text-sm text-muted-foreground">{categoryName(t.category)} · {t.area}</p>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1"><Star className="size-4 fill-primary text-primary transition-transform group-hover:rotate-12" />{t.rating}<span className="text-muted-foreground">({t.reviews})</span></span>
        <span className="text-muted-foreground">{t.years} yrs exp.</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {t.skills.map((s) => <span key={s} className="rounded-full border border-border px-2.5 py-1 text-xs">{s}</span>)}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground"><ShieldCheck className="size-4 text-primary" />ID check (demo)</span>
        <span>Visit <strong>{inr(t.visitCharge)}</strong></span>
      </div>
    </Link>
  );
}
