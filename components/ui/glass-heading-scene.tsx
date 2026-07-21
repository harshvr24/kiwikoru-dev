"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Center, MeshTransmissionMaterial, Text3D } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GlassEnvironment } from "@/components/sections/intro/intro-scene";
import { useQuality } from "@/lib/perf/use-quality";
import { useMode } from "@/lib/theme/use-mode";
import { makeSkyBackdrop } from "@/lib/theme/sky-backdrop";

/**
 * The page-heading liquid glass — the same refractive Text3D treatment as the
 * welcome wordmark, in a smoked charcoal tint, used as the <h1> for the five nav
 * pages (see page-header.tsx, which owns the layout and the fallback).
 *
 * Adapted from footer-glass-scene.tsx, minus everything that scene needs and
 * this one doesn't (mountains, the per-letter ridgeline occluder, the scroll
 * reveal rig). What's kept is the part that matters: a REQUEST-DRIVEN canvas.
 *
 * ── Why this is affordable ──────────────────────────────────────────────────
 * MeshTransmissionMaterial renders the scene to an offscreen buffer to refract
 * it — twice with `backside` on. That is the single most expensive effect in
 * this codebase, and here it sits on FIVE routes permanently. It only works
 * because the heading is STATIC: `frameloop="never"` means nothing paints unless
 * we ask, and the only things that change what the glass should look like are
 * the sky mode and a resize. So it paints a short burst at mount, a burst on
 * mode change, a burst on resize — and otherwise costs exactly zero.
 *
 * That is the "idles to zero" clause of the heavy-effect contract (CLAUDE.md).
 * If you ever add motion here (a hover tilt, a drift), it stops being free and
 * has to justify itself against that contract properly.
 *
 * Quality knobs come from lib/perf/tiers.ts and are SNAPSHOTTED AT MOUNT — the
 * working conventions require that a mid-session tier step-down never swaps out
 * a feature the user is looking at.
 */

const FONT = "/fonts/product-sans-medium.v2.typeface.json";

const CAMERA_Z = 5.4;

// ── Sizing: ONE glyph size for all five headings ────────────────────────────
//
// Driven by the viewport WIDTH and the WORST-CASE width-per-size — deliberately
// not per-word. Width-per-size is a property of the string (measured through the
// real TextGeometry: "about" 2.81 · "why us" 3.31 · "reviews" 3.62 · "contact"
// 3.64 · "services" 3.90), so fitting each word to the same width would render
// every page at a DIFFERENT letter size — "about" would tower over "services".
// Sizing off the widest instead gives identical letterforms on every page, with
// the words simply ending up different widths. That is the choice the design
// asked for.
//
// `fov` is vertical, so the height clamp below is the secondary guard: it stops
// a short stage from letting the glyph overflow vertically.
const WIDEST_PER_SIZE = 3.9; // "services", the longest heading
const WIDTH_SAFE_FRAC = 0.86;
const HEIGHT_FRAC = 0.78;

/**
 * The intro wordmark's glass, in sky blue.
 *
 * ⚠️ These are the WELCOME GLASS's exact values (see the <Text3D> block in
 * intro-scene.tsx) — ior 1.28, roughness 0.31, chromaticAberration 0.65,
 * clearcoat 0, temporalDistortion 0.28, and the absolute lengths thickness 0.3 /
 * bevelThickness 0.175 / bevelSize 0.095 / letterSpacing +0.02. The brief was
 * "same font, same design" as the intro, so this must stay in lockstep with it.
 * An earlier pass had its own tuning (ior 1.42, clearcoat 1, size-proportional
 * lengths) and read as a visibly different material.
 *
 * The absolute lengths work here because the sizing above lands the glyph at
 * ~3.3 world units — inside the intro's own ~4–5 range. If the stage geometry
 * ever changes enough to move that materially, these need revisiting rather than
 * silently drifting.
 *
 * ── The tint ────────────────────────────────────────────────────────────────
 * Colour in MeshTransmissionMaterial is Beer–Lambert ABSORPTION, not a fill:
 * light is tinted by `attenuationColor` in proportion to how far it travels
 * through the solid, over `attenuationDistance`. Turning `color` down does not
 * tint it — it just dulls the highlights.
 *
 * Sky blue = the intro's LONG distance (4) with a blue attenuation colour
 * instead of the intro's near-white #eaf4ff. Long distance keeps it translucent
 * so the refraction and chromatic edges survive; the hue simply reads a shade
 * deeper than the sky behind it. Swap ATTENUATION_COLOR alone to recolour.
 */
const ATTENUATION_COLOR = "#7fb4f0"; // sky blue — one shade deeper than the sky

const GLASS = {
  color: "#ffffff",
  attenuationColor: ATTENUATION_COLOR,
  attenuationDistance: 4,
  thickness: 0.3,
  backsideThickness: 0.4,
  bevelThickness: 0.175,
  bevelSize: 0.095,
  letterSpacing: 0.02,
  distortionScale: 0.4,
  ior: 1.28,
  roughness: 0.31,
  chromaticAberration: 0.65,
  anisotropicBlur: 0.28,
  distortion: 0.2,
  temporalDistortion: 0.28,
} as const;

/** Frames to paint for a single "something changed" burst. */
const BURST = 12;

/**
 * Paint scheduler. The canvas is `frameloop="never"`, so nothing renders until
 * something calls advance(). This rides the SHARED GSAP ticker rather than a
 * private rAF loop (the one-loop mandate in CLAUDE.md), and only advances while
 * it has frames owed — so at rest the ticker callback does a single integer
 * compare and returns.
 */
function RenderPump({ burstRef }: { burstRef: React.RefObject<number> }) {
  const advance = useThree((s) => s.advance);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const tick = (time: number) => {
      if (burstRef.current <= 0) return;
      burstRef.current -= 1;
      advance(time);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [advance, burstRef]);

  // The drei <Center> re-measures and the Text3D geometry builds over a few
  // frames; a single paint can land on a blank or mid-layout frame.
  useEffect(() => {
    burstRef.current = BURST * 2;
  }, [burstRef, gl]);

  // Re-burst when the tab becomes visible again. A background tab pauses rAF,
  // which stops the GSAP ticker, which means this canvas cannot paint at all
  // while hidden — verified: a heading mounted in a hidden tab measures a
  // correctly-sized canvas with nothing drawn on it. The owed burst does survive
  // (the pump only decrements when it actually advances), so it would normally
  // paint on return anyway; this is the belt-and-braces for the cases where it
  // wouldn't — a throttled tick that consumed the burst without a real paint, or
  // a GL context the browser dropped while backgrounded.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") burstRef.current = BURST;
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [burstRef]);

  return null;
}

/** Re-burst whenever the canvas is resized (its rect drives the projection). */
function ResizeBurst({ burstRef }: { burstRef: React.RefObject<number> }) {
  const size = useThree((s) => s.size);
  useEffect(() => {
    burstRef.current = BURST;
  }, [size.width, size.height, burstRef]);
  return null;
}

function GlassWord({
  text,
  background,
}: {
  text: string;
  background: THREE.Texture;
}) {
  // Snapshot the tier ONCE at mount (see the header note): a watchdog
  // step-down mid-session must not re-tessellate or re-FBO a heading the user
  // is currently reading.
  const live = useQuality();
  const [q] = useState(live);

  // ONE size for every heading: the width rule (worst-case word) is primary, the
  // height rule only clamps a short stage. See the constants above.
  const viewport = useThree((s) => s.viewport);
  const size = Math.min(
    (viewport.width * WIDTH_SAFE_FRAC) / WIDEST_PER_SIZE,
    viewport.height * HEIGHT_FRAC,
  );

  return (
    <Center>
      <Text3D
        font={FONT}
        size={size}
        height={0}
        curveSegments={q.text3dCurveSegments}
        bevelEnabled
        bevelThickness={GLASS.bevelThickness}
        bevelSize={GLASS.bevelSize}
        bevelOffset={0}
        bevelSegments={q.text3dBevelSegments}
        letterSpacing={GLASS.letterSpacing}
      >
        {text}
        <MeshTransmissionMaterial
          background={background}
          transmission={1}
          thickness={GLASS.thickness}
          roughness={GLASS.roughness}
          ior={GLASS.ior}
          chromaticAberration={GLASS.chromaticAberration}
          anisotropicBlur={GLASS.anisotropicBlur}
          distortion={GLASS.distortion}
          distortionScale={GLASS.distortionScale}
          temporalDistortion={GLASS.temporalDistortion}
          samples={q.mtmSamples}
          // The INTRO's FBO, not the footer's smaller one — the brief is to match
          // the welcome glass, and this material is far less blurred than the
          // footer's (roughness 0.31 / anisotropicBlur 0.28), so a small buffer
          // would show as softness the intro doesn't have.
          resolution={q.mtmResolution}
          backside={q.mtmBackside}
          backsideThickness={GLASS.backsideThickness}
          clearcoat={0}
          clearcoatRoughness={0}
          attenuationDistance={GLASS.attenuationDistance}
          attenuationColor={GLASS.attenuationColor}
          color={GLASS.color}
        />
      </Text3D>
    </Center>
  );
}

export default function GlassHeadingScene({ text }: { text: string }) {
  const burstRef = useRef(BURST * 2);
  const mode = useMode();

  // The sky gradient the glass refracts. Rebuilt per mode; disposed with it.
  const sky = useMemo(() => makeSkyBackdrop(mode), [mode]);
  useEffect(() => {
    burstRef.current = BURST;
    return () => sky.texture.dispose();
  }, [sky]);

  return (
    <Canvas
      frameloop="never"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, stencil: false }}
      camera={{ position: [0, 0, CAMERA_Z], fov: 45 }}
      onCreated={({ gl }) => {
        // Match the intro/footer/lab render: the bright env carries the
        // highlights, so no ACES roll-off (which greys the glass).
        gl.toneMapping = THREE.NoToneMapping;
      }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <GlassWord text={text} background={sky.texture} />
        {/* The exact studio glints the intro / footer / lab glass use — without
            these the bevel silhouette picks up dark directions and the glyph
            outline goes muddy. */}
        <GlassEnvironment />
        <directionalLight position={[3, 5, 6]} intensity={1.1} />
        <ambientLight intensity={0.35} />
        <RenderPump burstRef={burstRef} />
        <ResizeBurst burstRef={burstRef} />
      </Suspense>
    </Canvas>
  );
}
