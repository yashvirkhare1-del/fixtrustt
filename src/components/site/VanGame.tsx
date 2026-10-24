import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, House, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

// R = road, . = block, S = start, H = house
const MAP = ["RRRR.RRH", "R..R.R..", "R..RRR..", "RR.R...R", ".R.RRRRR", "SR......"];
const ROWS = MAP.length;
const COLS = MAP[0].length;
const find = (ch: string) => { for (let y = 0; y < ROWS; y++) { const x = MAP[y].indexOf(ch); if (x >= 0) return { x, y }; } return { x: 0, y: 0 }; };
const START = find("S");
const GOAL = find("H");
const MAX_DIST = Math.abs(START.x - GOAL.x) + Math.abs(START.y - GOAL.y);
const walkable = (x: number, y: number) => x >= 0 && y >= 0 && x < COLS && y < ROWS && MAP[y][x] !== ".";

type Dir = "up" | "down" | "left" | "right";
const delta: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function VanGame() {
  const [pos, setPos] = useState(START);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started || won) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 250);
    return () => clearInterval(t);
  }, [started, won]);

  const move = useCallback((d: Dir) => {
    if (won) return;
    const nx = pos.x + delta[d][0], ny = pos.y + delta[d][1];
    if (!walkable(nx, ny)) return;
    setPos({ x: nx, y: ny });
    setMoves((m) => m + 1);
    setStarted((s) => s ?? Date.now());
    if (nx === GOAL.x && ny === GOAL.y) setWon(true);
  }, [won, pos]);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, Dir> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
    const d = map[e.key];
    if (d) { e.preventDefault(); move(d); }
  };

  const reset = () => { setPos(START); setMoves(0); setStarted(null); setElapsed(0); setWon(false); boardRef.current?.focus(); };
  const dist = Math.abs(pos.x - GOAL.x) + Math.abs(pos.y - GOAL.y);
  const progress = Math.round((1 - dist / MAX_DIST) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div
        ref={boardRef}
        tabIndex={0}
        onKeyDown={onKey}
        role="application"
        aria-label="Neighbourhood map. Use arrow keys to drive the van to the house."
        className="relative rounded-2xl border border-feature-foreground/15 bg-feature-foreground/5 p-3 focus-visible:outline-2 focus-visible:outline-highlight"
      >
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
          {MAP.flatMap((row, y) => row.split("").map((c, x) => (
            <div key={`${x}-${y}`} className={`van-cell aspect-square rounded-md ${c === "." ? "bg-feature-foreground/10" : "bg-feature-foreground/[0.03] border border-dashed border-feature-foreground/20"}`}>
              {c === "H" && <div className="flex size-full items-center justify-center text-highlight"><House className="size-1/2" /></div>}
              {c === "S" && <div className="flex size-full items-end justify-center pb-1 text-[10px] font-semibold uppercase text-feature-muted">Start</div>}
            </div>
          )))}
        </div>
        <div className="pointer-events-none absolute inset-3">
          <div className="van-token absolute flex items-center justify-center" style={{ width: `${100 / COLS}%`, height: `${100 / ROWS}%`, transform: `translate(${pos.x * 100}%, ${pos.y * 100}%)` }}>
            <span className="flex size-3/4 items-center justify-center rounded-lg bg-highlight text-highlight-foreground shadow-lg"><Truck className="size-1/2" /></span>
          </div>
        </div>
        {won && (
          <div className="win-pop absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-feature/90 text-center">
            <p className="font-display text-5xl uppercase text-highlight">Arrived!</p>
            <p className="mt-2 text-sm text-feature-muted">{moves} moves · {elapsed}s</p>
            <Button onClick={reset} className="mt-5 rounded-full bg-highlight text-highlight-foreground hover:bg-highlight/90"><RotateCcw /> Play again</Button>
          </div>
        )}
      </div>

      <div>
        <dl className="grid grid-cols-3 gap-3 text-center">
          {[["Time", `${elapsed}s`], ["Moves", moves], ["Progress", `${progress}%`]].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-feature-foreground/15 p-3"><dt className="text-xs uppercase text-feature-muted">{k}</dt><dd className="mt-1 font-display text-3xl">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-feature-foreground/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Distance to house">
          <div className="h-full bg-highlight transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mx-auto mt-6 grid w-44 grid-cols-3 gap-2" aria-label="Driving controls">
          <span />
          <Button variant="outline" size="icon" aria-label="Up" onClick={() => move("up")} className="size-12 border-feature-foreground/25 bg-transparent text-feature-foreground hover:bg-highlight hover:text-highlight-foreground"><ArrowUp /></Button>
          <span />
          <Button variant="outline" size="icon" aria-label="Left" onClick={() => move("left")} className="size-12 border-feature-foreground/25 bg-transparent text-feature-foreground hover:bg-highlight hover:text-highlight-foreground"><ArrowLeft /></Button>
          <Button variant="outline" size="icon" aria-label="Down" onClick={() => move("down")} className="size-12 border-feature-foreground/25 bg-transparent text-feature-foreground hover:bg-highlight hover:text-highlight-foreground"><ArrowDown /></Button>
          <Button variant="outline" size="icon" aria-label="Right" onClick={() => move("right")} className="size-12 border-feature-foreground/25 bg-transparent text-feature-foreground hover:bg-highlight hover:text-highlight-foreground"><ArrowRight /></Button>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs leading-relaxed text-feature-muted">Just for fun. This is a game, not live repair tracking.</p>
          <Button variant="ghost" size="sm" onClick={reset} className="text-feature-foreground hover:bg-feature-foreground/10 hover:text-feature-foreground"><RotateCcw /> Restart</Button>
        </div>
      </div>
    </div>
  );
}
