/**
 * Runtime frame-time watchdog (docs/performance-audit.md §6 C3).
 *
 * Rides the ONE shared GSAP ticker (no new rAF loop — same mandate as
 * lenis-provider.tsx). Keeps an EMA of frame time; if it stays above the budget
 * for a sustained window, it steps the quality tier DOWN once, then cools off.
 * This is what actually delivers the "60 fps floor": capable machines sit at
 * high forever, struggling ones settle onto a tier they can sustain.
 *
 * The tick receives GSAP's `deltaMs` (ms since last tick) directly — with
 * lagSmoothing(0) set globally it's the raw, unsmoothed frame time we want.
 *
 * THE BUDGET IS REFRESH-RATE-AWARE. A fixed ~12 ms budget only makes sense on a
 * 120 Hz panel (8.3 ms native frame) — on a perfectly healthy 60 Hz display rAF
 * *cannot* deliver faster than ~16.7 ms deltas, so a fixed 12 ms budget would
 * demote every 60 Hz machine on pure arithmetic, no jank required. Instead the
 * budget is derived from the measured refresh rate:
 *
 *   threshold = max(12, (1000 / refreshHz) * 1.45)
 *
 * i.e. the EMA must sit ~45% over the display's native frame time before we call
 * it a sustained overrun. At 120 Hz that evaluates to ~12.1 ms (the original
 * fast-panel behavior, preserved); at 60 Hz it becomes ~24.2 ms (≈41 fps), so
 * only genuine dropped-frame jank trips it. The Hz measurement (refresh-rate.ts)
 * settles asynchronously, so the threshold is recomputed from the store on every
 * sample — one function call per tick, effectively free — rather than cached at
 * arm time with a possibly stale pre-settle value.
 *
 * ── CALIBRATE ── the 1.45 ratio /SUSTAIN/WARMUP/COOLDOWN are conservative
 * starting points. Tune the ratio against a real weak GPU: too low demotes
 * healthy machines riding their native cadence; too high never catches a
 * genuine sustained stutter.
 *
 * ── PARKED rAF vs A SLOW FRAME ──────────────────────────────────────────────
 * Both produce a huge delta, and telling them apart is the whole game. This used
 * to be done by MAGNITUDE — `if (deltaMs > 200) return;` — which inverted the
 * safety net: it caught mild jank (25–200 ms) and went completely blind exactly
 * when the GPU was drowning, because those frames blow straight past 200 ms and
 * every one of them was discarded. The EMA never rose, stepDownTier() never
 * fired, and the session stayed pinned to a tier it could not sustain until the
 * compositor wedged. That is the mechanism behind the hard scroll freeze
 * (renderer stops painting at a fixed scroll position while JS stays alive):
 * forcing a lower tier by hand fixed it, proving the tier system would have
 * rescued the session if it had ever been told.
 *
 * So the discard now keys on `document.visibilityState` — the actual cause of
 * parking — plus the one tick after returning to visible, which is where the
 * parked gap lands. Long frames while VISIBLE are the signal, not noise: they
 * are CLAMPED into the average rather than thrown away.
 */

import gsap from "gsap";
import { getRefreshHz, stepDownTier } from "./quality-store";

export interface WatchdogOptions {
  /**
   * Fixed frame-time budget in ms; sustained overrun triggers a step-down.
   * When set it wins outright — the refresh-aware derivation is bypassed.
   */
  thresholdMs?: number;
  /** EMA smoothing factor (0–1); higher = reacts faster, noisier. */
  emaAlpha?: number;
  /** How long the EMA must stay over budget before stepping down (ms). */
  sustainMs?: number;
  /** Grace period after start — ignores the boot/intro compile burst (ms). */
  warmupMs?: number;
  /** Quiet period after a step-down before another can fire (ms). */
  cooldownMs?: number;
}

// Never budget tighter than this, whatever the panel claims (see file header).
const THRESHOLD_FLOOR_MS = 12;
// The EMA must sit this far over the display's native frame time to count as an
// overrun — riding the native cadence (16.7 ms on 60 Hz) is healthy, not jank.
const OVER_BUDGET_RATIO = 1.45;
// Visible frames are CLAMPED to this before entering the EMA (they used to be
// discarded above it — see the file header). High enough to sit far over any
// realistic threshold so one bad frame still registers as trouble, low enough
// that a single 3-second stall can't dominate the average for a minute after.
const MAX_SAMPLE_MS = 200;
// A visible frame this slow is not "jank", it's the GPU failing to keep up. Two
// CONSECUTIVE of them step the tier down immediately, bypassing SUSTAIN_MS —
// with the clamp alone a machine rendering at ~1 fps needs ~3 ticks (≈2.7 s of
// frozen scrolling) to be rescued. Two rather than one so an isolated GC pause,
// a lazy chunk compile in dev, or a tab-switch hiccup can't demote a healthy
// machine on a single sample.
const EMERGENCY_MS = 400;
const EMERGENCY_STREAK = 2;

export function startFrameWatchdog(opts: WatchdogOptions = {}): () => void {
  // Refresh-aware budget, re-read per sample: the Hz measurement can settle
  // AFTER arming, and getRefreshHz() is a plain field read — cheaper than any
  // subscribe-and-cache dance would be. An explicit opts.thresholdMs pins it.
  const thresholdMs = () =>
    opts.thresholdMs ??
    Math.max(THRESHOLD_FLOOR_MS, (1000 / getRefreshHz()) * OVER_BUDGET_RATIO);
  const EMA_ALPHA = opts.emaAlpha ?? 0.1;
  const SUSTAIN_MS = opts.sustainMs ?? 1500;
  // Short by design: the controller already arms this AFTER the intro transient,
  // so warmup only needs to absorb the first-frame burst at the arm moment.
  const WARMUP_MS = opts.warmupMs ?? 1000;
  const COOLDOWN_MS = opts.cooldownMs ?? 4000;

  let ema = 0;
  let startedAtMs = -1;
  let overSinceMs = -1;
  let lastStepMs = -Infinity;
  let emergencyStreak = 0;
  // The tick right after a hidden→visible flip carries the whole parked gap.
  let skipResumeTick = false;

  const tick = (timeSec: number, deltaMs: number) => {
    const nowMs = timeSec * 1000;
    if (startedAtMs < 0) startedAtMs = nowMs;

    if (deltaMs <= 0) return;

    // ── Parked rAF, not a slow frame ──
    // Keyed on visibility rather than on how big the delta is — see the file
    // header for why magnitude is not a safe proxy. Note this in-tick check is
    // only a backstop: a hidden tab usually stops rAF ENTIRELY, so this branch
    // may never run. The visibilitychange listener below is what actually arms
    // `skipResumeTick`, because the parked gap lands on the first tick AFTER
    // returning to visible — and without dropping that one sample it would look
    // like a multi-second frame and trip the emergency path on every tab switch.
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      ema = 0;
      overSinceMs = -1;
      emergencyStreak = 0;
      skipResumeTick = true;
      return;
    }
    if (skipResumeTick) {
      skipResumeTick = false;
      return;
    }

    // Visible and slow = real render cost. CLAMP it in rather than drop it.
    const sample = Math.min(deltaMs, MAX_SAMPLE_MS);
    ema = ema === 0 ? sample : ema + EMA_ALPHA * (sample - ema);

    if (nowMs - startedAtMs < WARMUP_MS) return;
    if (nowMs - lastStepMs < COOLDOWN_MS) {
      overSinceMs = -1;
      emergencyStreak = 0;
      return;
    }

    // ── Emergency: the GPU is failing outright, don't wait out SUSTAIN_MS ──
    // Uses the RAW delta: the clamp exists to protect the average, but the
    // decision "is this machine drowning right now" wants the true frame cost.
    if (deltaMs >= EMERGENCY_MS) {
      emergencyStreak += 1;
      if (emergencyStreak >= EMERGENCY_STREAK) {
        if (stepDownTier()) lastStepMs = nowMs;
        emergencyStreak = 0;
        overSinceMs = -1;
        return;
      }
    } else {
      emergencyStreak = 0;
    }

    if (ema > thresholdMs()) {
      if (overSinceMs < 0) {
        overSinceMs = nowMs;
      } else if (nowMs - overSinceMs >= SUSTAIN_MS) {
        if (stepDownTier()) lastStepMs = nowMs;
        overSinceMs = -1;
      }
    } else {
      overSinceMs = -1;
    }
  };

  // The real parked-rAF guard (see the note in `tick`). Backgrounding stops rAF,
  // so we cannot rely on observing a tick while hidden — we arm the skip here,
  // on the transition itself, and clear the running state on the way out so a
  // spell in the background can't be mistaken for sustained overrun on return.
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      ema = 0;
      overSinceMs = -1;
      emergencyStreak = 0;
    } else {
      skipResumeTick = true;
    }
  };
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  };
}
