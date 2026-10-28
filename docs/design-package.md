# AYLA Collective — Design Package

Source of truth for every creative decision. Every viewer-facing line lives verbatim in
`src/content.mjs`; the build wires it in and never paraphrases it.

## 1. Brand premise

**The leak.** Growth rarely stalls; it leaks, in the gaps between the ad, the website, the
reply, and the follow-up. AYLA finds the leak and builds one connected system around it.
Every section teaches one half of that idea: something is slipping (the problem), then it
gets connected (the system). The hero shows it physically: four glass rings tumble out of
sync, and scrolling locks them into one aligned system.

## 2. Palette (CSS tokens)

```css
--ink:#0A0909;     /* page, warm-tinted black, never #000 */
--ink-2:#121011;   /* raised surfaces */
--ink-3:#1B1819;   /* cards, inputs */
--bone:#F1EEEA;    /* primary text on dark */
--bone-2:#E9E5E0;  /* light section background */
--mute:#8E8987;    /* secondary text on dark (5.7:1) */
--mute-ink:#5B5655;/* secondary text on bone */
--line:rgba(241,238,234,.10);
--line-strong:rgba(241,238,234,.28); /* interactive borders, 3:1 */
--signal:#FF3B2F;  /* brake-light red: CTAs, hover glow, leaks, focus. Rare doses. */
--signal-hot:#FF5A4F;
--signal-glow:rgba(255,59,47,.55);
```
Button labels on red are ink (5.6:1), never white (3.5:1 fails AA at body size).
Glass edges carry a faint white-to-red gradient, not the rainbow conic from the spec, so the
palette stays strictly black, white, red.

## 3. Type

- Display: **Funnel Display** 500/600, uppercase, tracking -0.035em, line-height .88. The closest
  open-licence match to Clash Grotesk; self-hosted, no third-party font host.
- Accent: **Instrument Serif Italic**, one or two words per headline, set in red.
- Body/UI: **Instrument Sans** (variable) 400/500, 17–18px, line-height 1.55, max 62ch.
- Labels: **Geist Mono** 11–12px uppercase, tracking .14em.

## 4. Hero beat map (pinned, 230vh)

| Band | Range | Rings | Copy | Entrance |
|---|---|---|---|---|
| 1 | 0.00–0.42 | tumbling out of sync | H1 "Turn attention into *revenue.*", sub, two CTAs | masked word rise on load |
| 2 | 0.55–1.00 | locked, aligned, red signal orbiting | "When everything pulls the same way, growth *compounds.*" | approach-from-depth |

Readout chip (mono, 10Hz): `SYSTEM SYNC 012%` climbing to `100%`. Ring labels 01–04 float
beside the rings and converge.

## 5. Static hero (phones, reduced motion, no WebGL)

A still render of the aligned rings (captured from the live scene) behind the same H1, sub,
and CTAs. Band 2 copy shows below the hero as a normal line.

## 6. Homepage order

01 Hero · 02 Proof (placeholder stats + industries marquee) · 03 The Leak (interactive) ·
04 The System (pinned horizontal, four pillars) · 05 Industries · 06 Approach (bone) ·
07 Growth audit calculator · 08 Work (placeholders) · 09 Founders (bone) ·
10 Testimonials (placeholders, drag carousel) · 11 Insights · 12 FAQ · 13 Final CTA · Footer

No two neighbours share a skeleton: centered stats → wide canvas → pinned horizontal →
three tall cards → bone timeline → split calculator → full-bleed case rows → bone portraits →
drag track → list rows → accordion → full-viewport type.

## 7. The one interactive moment

**Hold to connect the system** (section 03). Pressing and holding seals the four leaks one by
one; the particle simulation stops dripping red and the "leads reaching revenue" counter,
counted from the simulation itself, climbs. Releasing early eases back. Keyboard: hold Space
or Enter. Reduced motion: shows the connected state.

## 8. Signature and vector layer

- Signature: the Gyroscope (WebGL). Remove it and the page loses its thesis.
- Glass UI: blur 24px (14px mobile), gradient hairline edge via mask-composite, pointer-tracked
  specular, red glow on hover for every button, card, and chip.
- Self-drawing red signal line through the System cards and the Approach timeline.
- Fixed environment layer: slow drifting red and white light, film grain, vignette (90s cycle).
- Final CTA: a glass lens follows the cursor and magnifies the type beneath it.
- Footer: full-width AYLA wordmark with a red sheen that tracks the pointer.

## 9. Engineering list

Static multi-page site, no framework. One rAF loop that rests when idle; IntersectionObserver
for visibility; animate transform and opacity only; WebGL loads after first paint, only with
WebGL2 + fine pointer + width > 720 + no reduced motion; DPR capped at 1.5; render paused
off-screen and on hidden tabs; Lenis on fine pointers only; reduced motion honored live;
`overflow-x: clip` on html and body; skip link, landmarks, focus-visible in red, 44px touch
targets; unique titles, descriptions, JSON-LD (Organization, ProfessionalService, FAQPage,
Article, BreadcrumbList), sitemap, robots.

## 10. Copy gate

Every line ships verbatim from `src/content.mjs`. Before anyone sees the build: zero em dashes,
zero stock words (leverage, seamless, empower, unlock, robust, actionable, data-driven,
solutions), and a sweep for "not just X", vague attributions, and big-finish clichés.
Deliberate devices stay: "Diagnose. Build. Launch. Optimize." and AYLA's own lines.

## 11. To confirm with AYLA (rendered as clearly marked placeholders)

Results and stats · client logos · case studies · testimonials · founder portraits, bios,
LinkedIn · step timings · sub-service lists for Acquire, Convert, Automate · location /
service area · social links · CRM, booking (Cal.com) and form endpoint.
