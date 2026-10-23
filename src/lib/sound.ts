import { useSyncExternalStore } from "react";

const KEY = "ft-sound";
const listeners = new Set<() => void>();
let enabled = false;
let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  if (typeof window === "undefined") return;
  enabled = window.localStorage.getItem(KEY) === "1";
}

function notify() {
  listeners.forEach((l) => l());
}

export function isSoundEnabled() {
  init();
  return enabled;
}

export function toggleSound() {
  init();
  enabled = !enabled;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, enabled ? "1" : "0"); } catch { /* ignore */ }
  }
  notify();
  return enabled;
}

function subscribe(l: () => void) {
  init();
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, () => enabled, () => false);
}

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gain: number, delay = 0) {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const playClick = () => tone(523.25, 0.08, "sine", 0.04);
export const playSelect = () => { tone(440, 0.06, "sine", 0.03); tone(587.33, 0.08, "sine", 0.03, 0.04); };
export const playSuccess = () => {
  tone(523.25, 0.12, "sine", 0.05);
  tone(659.25, 0.12, "sine", 0.05, 0.1);
  tone(783.99, 0.18, "sine", 0.05, 0.2);
};
