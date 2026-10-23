import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Droplets, House, WashingMachine, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { demoOffers } from "@/lib/offers";

const icons = { plumbing: Droplets, electrical: Zap, maintenance: House, appliance: WashingMachine };

export function Offers() {
  return (
    <section id="offers" aria-labelledby="offers-heading" className="mx-auto max-w-6xl px-6 pt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div><p className="text-sm font-semibold uppercase text-primary">Offers & Deals</p><h2 id="offers-heading" className="mt-3 max-w-xl font-display text-5xl leading-none md:text-7xl">Good repairs.<br />Better deals.</h2></div>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Demo offers, not live promotions. No discounts are applied to bookings.</p>
      </Reveal>
      <div className="offer-grid mt-10">
        {demoOffers.map((offer, i) => {
          const Icon = icons[offer.icon as keyof typeof icons];
          return <Reveal key={offer.id} delay={i * 80} className="h-full">
            <article className="lift group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
              <div className="offer-art relative flex h-44 items-center justify-center overflow-hidden bg-accent text-primary">
                <span className="absolute left-4 top-4 text-xs font-semibold uppercase">{offer.tag}</span>
                <span aria-hidden className="offer-art-lines absolute inset-0" />
                <Icon aria-hidden strokeWidth={1.2} className="relative size-20 transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute bottom-3 right-4 font-display text-4xl opacity-30">0{i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="self-start rounded-sm bg-highlight px-2 py-1 text-xs font-semibold text-highlight-foreground">Demo offer</span>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{offer.name}</h3>
                <p className="mt-2 font-display text-2xl uppercase leading-tight">{offer.offer}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{offer.description}</p>
                <p className="mb-5 mt-4 text-xs leading-relaxed text-muted-foreground">{offer.condition}</p>
                <Button asChild variant="outline" className="mt-auto w-full justify-between"><Link to="/technicians" search={{ category: offer.category }}>Explore service <ArrowUpRight /></Link></Button>
              </div>
            </article>
          </Reveal>;
        })}
      </div>
    </section>
  );
}