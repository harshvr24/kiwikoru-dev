# Content source & provenance

This project is a **merge of two unrelated codebases**. Neither is in git history here, so this file records where things came from.

| Layer | Origin |
| --- | --- |
| Design, layout, WebGL, build | `website-B/ascnd-design-main` — a Next.js 16 marketing single-pager built for **"ascnd"**, a design-subscription product |
| Copy, brand, service content | `website-A` — a Duplicator backup of **KiwiKoru Limited's** WordPress site |

## The content source

`website-A/backup_1_94c6e32c268d6ac95179_20260721084419_archive/`

- Duplicator Lite 1.5.16.1 backup, taken **2026-07-21 08:44 UTC**
- WordPress 6.9.5 · PHP 8.2.28 · MariaDB 11.8.2, Bitnami on AWS EC2 `3.105.162.172` (ap-southeast-2)
- Live domain: `kiwikoru.com` · site title "AWS CONSULTING PARTNER" · Astra theme
- Database dump: `dup-installer/dup-database__94c6e32-21084419.sql`

Essentially all usable copy came from **one page** — `wp_posts` ID 23, the front page:

- H1 — *"Premier AWS Migration & Managed Services"*
- Lede — *"Optimize your IT infrastructure with KiwiKoru, your trusted partner for AWS cloud solutions. We help businesses reduce costs and improve performance through expert AWS consulting, cloud migration strategies, and 24/7 system management."*
- **Six services, each with a full description** — AWS Consulting · Infra Management · Management Services · App Development · Migration · AWS Governance → `components/sections/service-list/service-list-data.ts`
- **Three "Why Choose Us" pillars, each with a full description** — Passionate · Professional · 24/7 monitoring → `components/sections/why-us-pillars/`
- **About copy** — "We help teams build the business of their dreams" + supporting paragraph → `components/sections/about-story/`
- **One real client testimonial** — attributed to Sarah Jenkins, CTO → `TESTIMONIALS[0]`
- **Real contact details** — see below
- Nav — Home · Services · About · Reviews · Why Us · Contact

### ⚠️ Correction: KiwiKoru DOES publish contact details

An earlier pass of this project recorded that KiwiKoru had no contact details, because the WordPress `admin_email` option is the untouched Bitnami default (`user@example.com`). **That was wrong.** The real details are in the *page body*, not the options table:

```
KIWIKORU LIMITED
67 Glenveagh Park Drive, Weymouth, Auckland 2103, New Zealand
+64 21 0816 2162   ·   info@kiwikoru.com
```

They are live on `/contact` (`components/sections/contact-card/contact-card.tsx`). Keep them exact — the only formatting applied is NZ mobile grouping on the phone number for display; `tel:` uses the raw `+642108162162`. Worth having the client confirm the grouping.

### ⚠️ A defect in the source, deliberately not carried across

`Infra Management` and `AWS Governance` shipped **byte-identical descriptions** on the WordPress site ("Control Without Compromise…"). That text is about governance, so it stays there; the Infra Management entry in `service-list-data.ts` is **authored** (flagged `authored: true`) to fill the gap. Don't "fix" it back to the duplicate — have the client supply the real one.

The 400 MB backup is **not** copied into this repo. It stays read-only in `website-A/`.

## What the source did NOT have

The WordPress site is thin: 3 pages, 2 stub posts, and a large amount of **unedited Astra starter-template copy** still sitting under the real content (a second set of blocks reading "Your Idea Matters! / Local Business / Online Store / Branding Design / …" — generic, and unrelated to AWS consulting). None of that was carried across.

It had **no** content for: pricing, a comparison, an FAQ, or a portfolio. Those carry authored placeholder copy, marked `PLACEHOLDER` in source. Find them all with:

```bash
grep -rn "PLACEHOLDER" components/sections components/ui
```

(One unrelated hit: `sections/intro/intro.tsx` uses the word in a technical comment about the intro's `<View>` tracking.)

### Not shippable as-is

- **`components/sections/testimonials/testimonials-data.ts`** — `TESTIMONIALS[0]` is **real** (Sarah Jenkins, CTO, verbatim, attributed). The **eight entries after it are invented**. They carry no `attribution`, so a fabricated line can never appear under a real name, but they are still fabricated feedback — and on `/reviews` they are the whole page. Replace them with permissioned quotes, or trim the list to the real one (a rotation of one simply stops cycling).
- **`components/sections/portfolio/cloud-canvas/cloud-canvas-data.ts`** — tiles are still the ascnd Figma collage (web/brand design stills, not cloud infrastructure). Names left as "Project NN" deliberately, so nothing reads as a real engagement.
- **`components/sections/pricing/pricing.tsx`** — the design shipped real prices ($5,995/mo, from $10,995) for the *previous* product. Both now read "custom"; insert real figures before launch.
- **`components/sections/logos/logos.tsx`** — the marquee lists AWS *services*, not clients. KiwiKoru has published no client list; inventing one would be a false claim of custom.
- **`components/ui/navbar.tsx`** — the four social links (Instagram, Facebook, X, LinkedIn) point at each network's **homepage**, not at KiwiKoru profiles. Real URLs were never supplied. Replace or remove them.

## The brand mark

`components/ui/brand-mark.tsx` is the one asset that **did** come from website-A. It was traced to vector from
`uploads/2025/12/Gemini_Generated_Image_ornffrornffrornf-removebg-preview.png`
(500×500, AI-generated), cropped to the cloud mark alone — the source file also contains a "KiwiKoru" wordmark band and Gemini's watermark sparkle, and **neither is in the trace**.

Verified at 99.72% pixel agreement / 99.56% IoU against the source alpha. It renders in `currentColor` (white), not the source's orange. It replaced the previous brand's chevron, which is deleted.

Still worth flagging to the client: this is AI-generated raster art traced to vector, not an authored logo, and no real vector master exists.

## Deliberately carried over unchanged

- All other imagery in `public/` (rocks, shots, cards, portfolio, clouds, textures) — per the brief, none of website-A's media was imported. Note that website-A's images were 16 Gemini-generated PNGs at 5–7 MB each and would need compressing to WebP/AVIF before any use.
- Figma node IDs in comments — still the authority for geometry, no longer for copy.
- `docs/` — the previous team's audit trail. Filenames and prose still say "ascnd"; left intact as history.

## Licensing note (carried over, unresolved)

**Product Sans is Google's proprietary corporate typeface.** It is self-hosted in `app/fonts/` and is the site's global default. This risk came with the design and now applies to KiwiKoru. Worth raising with the client.
