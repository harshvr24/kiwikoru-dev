import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Background from "@/components/background/background";
import CloudLayer from "@/components/background/cloud-layer";
import SharedCanvasHost from "@/components/canvas/shared-canvas-host";
import Cursor from "@/components/cursor/cursor";
import { FLAGS } from "@/lib/flags";
import LenisProvider from "@/components/providers/lenis-provider";
import QualityController from "@/components/providers/quality-controller";
import RouteTransition from "@/components/providers/route-transition";
import ThemeDriver from "@/components/providers/theme-driver";
import ModeSwitcher from "@/components/ui/mode-switcher";
import Navbar from "@/components/ui/navbar";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Instrument Serif — used for the italic-feel "guesswork" accent in the hero headline.
const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

// Product Sans (proprietary) — self-hosted from app/fonts/. Exposes
// --font-product-sans, consumed by --font-product in globals.css.
const productSans = localFont({
  variable: "--font-product-sans",
  display: "swap",
  src: [
    { path: "./fonts/ProductSans-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/ProductSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ProductSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ProductSans-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "kiwikoru — aws migration and managed services",
  description:
    "KiwiKoru is an AWS consulting partner. We cut cloud costs and lift performance through expert migration, infrastructure management, and 24/7 monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistMono.variable} ${productSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Warm the WebGL intro's Text3D font during HTML parse so it isn't a
            serial wait after the (lazy) intro chunk downloads — it gates the
            scene's ready signal. React 19 hoists this preload into <head>.
            crossOrigin must match the consumer or the preload is WASTED (audit
            H2: "credentials mode does not match" → double download): drei's
            useFont → THREE FileLoader fetches with mode "cors" / credentials
            "same-origin", which is exactly what crossOrigin="anonymous" makes
            this preload request. */}
        <link
          rel="preload"
          href="/fonts/product-sans-medium.v2.typeface.json"
          as="fetch"
          crossOrigin="anonymous"
        />
        {/* The bare cliff cut-outs are NOT hand-preloaded here anymore: the DOM
            <Rock> (rock.tsx) is `priority`, so next/image already emits an
            identical image preload in the SSR <head> (which also warms the cache
            the WebGL <Rocks> useTexture then hits). A manual dup just doubled the
            <link> for the same href. See docs/performance-audit.md A3. */}
        {/* The volumetric clouds' sprite (cloud-canvas.tsx <Clouds texture>).
            Its ONLY consumer is THREE's ImageLoader, whose default is
            crossOrigin="anonymous" (a CORS image request) — so the preload
            must say so too, or it never matches (audit H2). Gated with the
            cloud layer itself (lib/flags.ts) — an unconsumed preload is a
            wasted download + console warning. */}
        {FLAGS.clouds && (
          <link
            rel="preload"
            href="/textures/cloud-puff.png"
            as="image"
            crossOrigin="anonymous"
          />
        )}
        {/* Always open at the hero on a reload. The browser's default
            `scrollRestoration: "auto"` restores the previous scroll offset on
            refresh, which (a) drops the visitor mid-page instead of at the top
            and (b) makes intro-state's `atHeroTop()` read a non-zero scrollY and
            SUPPRESS the welcome. Switching to "manual" (set here during HTML
            parse, before hydration and before <Intro> reads scrollY) makes every
            reload load scrolled to the top — so the hero shows and the intro
            reliably replays. The property persists on the history entry, so it
            stays manual across subsequent refreshes. */}
        {/* ⚠️ These three run BEFORE FIRST PAINT and each exists to prevent a
            specific flash — see the comments on each. They use <Script
            strategy="beforeInteractive"> rather than a raw <script> tag because
            React 19 warns that a <script> rendered by a component never executes
            when that component renders on the client. `beforeInteractive` is the
            documented Next 16 route: injected into the initial HTML from the
            server and executed in the order placed (an `id` is REQUIRED for Next
            to track inline scripts). If you ever revert to raw <script> tags,
            keep them here at the top of <body>, before the content. */}
        <Script
          id="kk-scroll-restoration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history)history.scrollRestoration='manual';",
          }}
        />
        {/* Stamp the persisted sky mode onto <html> before first paint, so the
            correct --sky-* gradient (globals.css [data-mode]) and cloud palette
            render immediately — no flash of day-blue before hydration. Same
            synchronous-during-parse trick as the scripts around it; falls back to
            'day' on any invalid/blocked storage. Must match MODE_STORAGE_KEY +
            THEME_MODES in lib/theme/palette.ts. */}
        <Script
          id="kk-sky-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=localStorage.getItem('kiwikoru:mode');document.documentElement.dataset.mode=['sunrise','day','sunset','night'].indexOf(m)>-1?m:'day';}catch(e){document.documentElement.dataset.mode='day';}",
          }}
        />
        {/* Arm the on-load reveal before first paint. This runs synchronously
            during HTML parse (the same flash-prevention trick next-themes uses),
            so the `.reveal-armed` hidden state in globals.css applies the instant
            the hero renders — no flash of final-position text before hydration.
            JS-gated by design: no-JS visitors never get the class, so all text
            stays visible. The GSAP timeline (hero-reveal.tsx) then animates it in;
            the cliffs use the same armed state for their drift entrance
            (rock-reveal.tsx). */}
        <Script
          id="kk-reveal-armed"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('reveal-armed');",
          }}
        />
        {/* Adaptive-quality boot: detects refresh rate + GPU strength, picks a
            starting tier, and arms the frame-time watchdog on the shared ticker
            (docs/performance-audit.md §6). Renders nothing. */}
        <QualityController />
        {/* Crossfades the DOM sky (--sky-* vars) when the mode changes; renders
            nothing. Pairs with ThemeRig inside the cloud canvas (same CROSSFADE). */}
        <ThemeDriver />
        <LenisProvider>
          {/* Two independent fixed layers at the root: the sky backdrop
              (-z-20) and the volumetric clouds (-z-10), with page content
              stacking above both. Both must stay at the root — a blurred
              ancestor would break their `position: fixed`. The cloud layer is
              flag-benched (lib/flags.ts): flipped off, neither cloud canvas
              mounts and no cloud chunk/texture is ever fetched. */}
          <Background />
          {FLAGS.clouds && <CloudLayer />}
          {/* Shared-canvas host (docs/canvas-consolidation-plan.md Phase 1): two
              fixed effect planes (FRONT z-61 / REAR -z-10) that mount a <Canvas>
              only while a feature has registered a view via useSharedView. A
              sibling of the fixed sky layers (never an ancestor with a
              filter/backdrop-filter), and inside LenisProvider so its ticker-end
              advance pump rides the one shared GSAP ticker. With no views
              registered — every route but the /lab demo today — it renders
              nothing and creates no GL context. */}
          <SharedCanvasHost />
          {/* Resets scroll + re-measures ScrollTrigger + clears the intro gate on
              every client navigation. Inside LenisProvider so it can reach the
              Lenis instance. Renders nothing. */}
          <RouteTransition />
          {/* Site nav. Lives HERE, not in <Hero>, so all six routes get it — it
              is `fixed`, and a sibling of the fixed sky layers (never an ancestor
              with a filter/backdrop-filter, which would break their positioning).
              On `/` it still animates in as part of the hero cascade; on every
              other route it renders without the reveal hooks. See navbar.tsx. */}
          <Navbar />
          {children}
          {/* Custom cursor — last child so it paints on top (its glass lens
              samples everything behind it), and a sibling of the fixed sky
              layers so no filter/backdrop-filter ancestor breaks it. Gated to
              real-mouse desktops; renders nothing otherwise. */}
          <Cursor />
          {/* Sky-mode switcher — a fixed left-edge glass rail. Sibling of the
              fixed sky layers (no filter/backdrop-filter ancestor), so it never
              breaks their position:fixed. */}
          <ModeSwitcher />
        </LenisProvider>
      </body>
    </html>
  );
}
