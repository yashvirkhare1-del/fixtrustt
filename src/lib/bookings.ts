import { useSyncExternalStore } from "react";

export type DemoBooking = {
  ref: string;
  techId: string;
  techName: string;
  category: string;
  service: string;
  problem: string;
  date: string;
  slot: string;
  name: string;
  visitCharge: number;
  createdAt: string;
  status: "Scheduled" | "Cancelled";
};

const KEY = "ft-demo-bookings";
const EMPTY: DemoBooking[] = [];
const listeners = new Set<() => void>();
let cache: DemoBooking[] | null = null;

function read(): DemoBooking[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? (parsed as DemoBooking[]).filter((b) => b && typeof b.ref === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: DemoBooking[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); keep the in-memory copy for this session.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; listener(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function useBookings() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function makeRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `FT-${Array.from(bytes, (b) => chars[b % chars.length]).join("")}`;
}

export function addBooking(b: DemoBooking) {
  write([b, ...read()]);
}

export function cancelBooking(ref: string) {
  write(read().map((b) => (b.ref === ref ? { ...b, status: "Cancelled" as const } : b)));
}

export function clearBookings() {
  write([]);
}
