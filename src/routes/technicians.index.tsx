import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search, X } from "lucide-react";
import { TechCard } from "@/components/site/TechCard";
import { categories, categoryName, technicians, type Technician } from "@/lib/data";

const searchSchema = z.object({
  q: z.string().max(80).optional(),
  category: z.string().max(30).optional(),
  area: z.string().max(60).optional(),
  sort: z.enum(["rating", "price", "experience"]).optional(),
  max: z.coerce.number().int().min(0).max(10000).optional(),
});

type Filters = { q: string; category: string; area: string; sort: "" | "rating" | "price" | "experience"; max: number | "" };
const sorters = {
  rating: (a: Technician, b: Technician) => b.rating - a.rating,
  price: (a: Technician, b: Technician) => a.visitCharge - b.visitCharge,
  experience: (a: Technician, b: Technician) => b.years - a.years,
};

export const Route = createFileRoute("/technicians/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Find a repair professional — FixTrust" },
      { name: "description", content: "Search and filter sample repair professionals by service, area and problem." },
      { property: "og:title", content: "Find a repair professional — FixTrust" },
      { property: "og:description", content: "Compare pros by pricing, experience and reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  const { q = "", category = "", area = "", sort, max } = Route.useSearch();
  const navigate = useNavigate({ from: "/technicians/" });
  const set = (patch: Partial<Filters>) =>
    navigate({ search: (s) => { const n = { ...s, ...patch }; return { q: n.q || undefined, category: n.category || undefined, area: n.area || undefined, sort: n.sort || undefined, max: n.max || undefined }; }, replace: true });

  const needle = q.toLowerCase();
  const filtered = technicians.filter((t) =>
    (!category || t.category === category) &&
    (!area || t.area.toLowerCase().includes(area.toLowerCase())) &&
    (!max || t.visitCharge <= max) &&
    (!needle || [t.name, t.bio, categoryName(t.category), ...t.skills].join(" ").toLowerCase().includes(needle)),
  );
  const list = sort ? [...filtered].sort(sorters[sort]) : filtered;
  const hasFilters = !!(q || category || area || max);
  const control = "rounded-full border border-input bg-card px-4 py-2 text-sm outline-none transition focus:border-primary";

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12">
      <h1 className="animate-rise font-display text-5xl md:text-6xl">Find a professional</h1>
      <p className="mt-3 animate-rise text-muted-foreground" style={{ animationDelay: "100ms" }}>All profiles are illustrative samples for this prototype.</p>

      <div className="mt-10 grid animate-rise gap-3 md:grid-cols-2" style={{ animationDelay: "200ms" }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input aria-label="Search" value={q} maxLength={80} onChange={(e) => set({ q: e.target.value })} placeholder="Problem, skill or name" className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-10 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/15" />
          {q && <button aria-label="Clear search" onClick={() => set({ q: "" })} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></button>}
        </div>
        <input aria-label="Area" value={area} maxLength={60} onChange={(e) => set({ area: e.target.value })} placeholder="Area or city" className="w-full rounded-full border border-input bg-card px-5 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/15" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[{ slug: "", name: "All" }, ...categories].map((c) => (
          <button key={c.slug} onClick={() => set({ category: c.slug })} className={`rounded-full border px-4 py-2 text-sm transition ${category === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"}`}>{c.name}</button>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">{list.length} {list.length === 1 ? "professional" : "professionals"}</p>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Maximum visit charge" value={max ?? ""} onChange={(e) => set({ max: e.target.value ? Number(e.target.value) : "" })} className={control}>
            <option value="">Any visit charge</option>
            <option value="200">Visit up to ₹200</option>
            <option value="250">Visit up to ₹250</option>
            <option value="300">Visit up to ₹300</option>
          </select>
          <select aria-label="Sort by" value={sort ?? ""} onChange={(e) => set({ sort: e.target.value as Filters["sort"] })} className={control}>
            <option value="">Sort: Recommended</option>
            <option value="rating">Highest rated</option>
            <option value="price">Lowest visit charge</option>
            <option value="experience">Most experience</option>
          </select>
          {hasFilters && <button type="button" onClick={() => set({ q: "", category: "", area: "", max: "" })} className="px-2 text-sm text-primary underline underline-offset-4">Clear filters</button>}
        </div>
      </div>
      <div key={category + q + area + sort + max} className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => <div key={t.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}><TechCard t={t} /></div>)}
      </div>
      {list.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No matches. Try a different service or clear filters.</p>}
    </div>
  );
}
