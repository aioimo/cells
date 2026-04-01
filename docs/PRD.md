# Product Requirements Document

**Project**: Cellular Automata Gallery & Playground
**Date**: 2026-04-01
**Status**: Draft v1

---

## 1. Naming

The product needs a name that is poetic, memorable, and evocative rather than explanatory. It should suggest emergence, pattern, and quiet beauty — fitting the "art exhibit" identity.

### Candidates

| Name | Rationale |
|------|-----------|
| **Murmur** | Like a murmuration — collective behavior producing unexpected beauty from simple rules. Short, soft, memorable. |
| **Tessera** | A single tile in a mosaic. The plural (tesserae) evokes the grid. Art-historical weight without being academic. |
| **Still Life** | A term from cellular automata (a stable configuration) that doubles as an art genre. Quiet irony — the patterns are anything but still. |
| **Glimmer** | Transient light. Suggests the fleeting, shimmering quality of patterns that emerge and dissolve. |
| **Liminal** | Threshold states, in-between. Fits the experience of watching order emerge from chaos. |

**Recommendation**: **Murmur**. It works as a URL (`murmur.app`, `murmur.gallery`), sounds good spoken aloud, and captures the core experience — many simple things acting together to produce something unexpectedly beautiful.

---

## 2. Vision

Murmur is a curated digital gallery of cellular automata — an art exhibit you stumble into, not a simulator you configure. Visitors encounter striking visual patterns born from mathematical rules. The experience is contemplative first, interactive second, educational third.

The product serves two audiences through a single surface:
- **The casual visitor** (arrived via a striking Twitter clip) — stays for the beauty, maybe shares a piece
- **The curious mind** (math/CS-adjacent) — digs into the rules, tweaks colors, explores the collection

### Design philosophy

> Minimalist. Intentional. Every pixel earns its place.

- **Art exhibit, not control panel.** The gallery feels like walking through a museum — clean walls, good lighting, the work speaks.
- **Curated over comprehensive.** Not every scenario deserves the front wall. The best ones do.
- **Progressive disclosure.** Beauty first. Explanation available but never forced. Controls exist but don't crowd.
- **Quiet confidence.** No "Welcome to our app!" banners. No feature tours. The work is the introduction.

---

## 3. Target Audience

### Primary: The Scroller (reach)
- Encounters Murmur content on social media (Twitter/X, TikTok, Instagram)
- Clicks through to the gallery out of visual curiosity
- Spends 1-5 minutes browsing, maybe watches a few simulations
- Might share a piece or save a screenshot
- **Need**: instant visual payoff, zero friction, shareable moments

### Secondary: The Explorer (depth)
- Math/CS enthusiasts, generative art fans, creative coders
- Wants to understand *why* patterns form
- Will read descriptions, try different scenarios, tweak colors
- Might return multiple times
- **Need**: depth behind the beauty, ability to make it their own

### Tertiary: The Creator (admin — the project owner)
- Uses Murmur as a content engine for social media
- Needs efficient workflows to produce clips, screenshots, and posts
- Curates which scenarios are publicly featured
- **Need**: admin tools for curation and content export

---

## 4. Current State Assessment

### What exists (35 scenarios, 20 rules, 5 themes)
- Functional gallery grid with thumbnails and hover overlays
- Simulator with start/pause/step/reset controls
- Theme switcher (dark, light, neon, warm, ocean)
- Tag system (44 tags) and scenario metadata
- Screenshot/thumbnail generation pipeline
- Responsive layout with mobile support

### What's working
- Strong mathematical foundation — the rules produce genuinely interesting behavior
- Good variety across rule families (majority, RPS, drift, group theory)
- Solid engine architecture (toroidal grid, loop detection, state history)

### What needs to change
- **Gallery feels like a developer's index**, not an exhibit. All 35 scenarios shown equally, no hierarchy of visual impact.
- **Color palettes clash.** Each scenario defines its own colors without a cohesive aesthetic language across the collection.
- **Information overload.** Color tables, iteration counts, and descriptions compete for attention during the experience.
- **No share/export path.** Beautiful moments happen and disappear — no way to capture or share them.
- **No curation layer.** No distinction between "must-see" pieces and niche experiments.
- **Controls are utilitarian.** Buttons feel like a debug toolbar, not part of an exhibit.

---

## 5. Product Requirements

### Phase 1: The Gallery (foundation)

The gallery is the front door. It must make a strong first impression and guide visitors toward the most striking experiences.

#### P1.1 — Curation system
- Each scenario gains a `curated: boolean` field (in scenario metadata or a separate curation config)
- The public gallery shows **only curated scenarios** by default
- Admin mode (activated via URL param, local storage flag, or similar low-friction mechanism) reveals all scenarios and provides toggle controls for curation status
- Curated scenarios should be orderable (manual sort order, not alphabetical)

#### P1.2 — Gallery redesign
- **Hero piece**: the gallery opens with a single large featured scenario (auto-playing silently or showing a striking static frame)
- **Grid below**: curated scenarios in a clean masonry or uniform grid
- **Card treatment**: each card shows the thumbnail and the scenario name only. No tags, no descriptions, no rule labels on the public surface. Information is revealed on click/tap, not hover.
- **Breathing room**: generous whitespace, no clutter. The grid gap should feel intentional, not packed.
- **Typography**: move away from monospace for display text. A clean sans-serif (e.g., Inter, DM Sans, or similar) for headings/labels. Monospace retained only where it's semantically meaningful (iteration counters, code references).
- **Color palette**: the gallery page itself uses a single, restrained palette. Scenario thumbnails provide all the color.

#### P1.3 — Scenario detail / simulator redesign
- Clicking a gallery card enters the **exhibit view**: the simulation runs full-bleed (or near full-bleed) as the centerpiece
- **Controls are minimal and recessed**: small, semi-transparent play/pause/reset affordances that fade when not in use (think: video player controls)
- **Title and description** appear as a quiet overlay or side panel — present but not competing with the visual
- **Iteration counter** is subtle (small, low-contrast) — it's metadata, not a feature
- **Color table is hidden by default** — available via an "info" toggle for those who want it
- **Back to gallery** is a clean, unobtrusive gesture (back arrow, swipe, escape key)

#### P1.4 — Color customization (user interaction)
- Within the exhibit view, users can access a **palette editor**
- Shows the current scenario's color set and allows swapping individual colors
- Provides 3-5 preset palettes per scenario (curated alternatives that are known to look good)
- Custom changes are ephemeral (reset on reload) unless the user explicitly saves to local storage
- This is the **only parameter users can tweak** in Phase 1

### Phase 2: The Share (distribution)

Turn beautiful moments into shareable content — for the admin (content creation) and for users (social sharing).

#### P2.1 — Clip capture (admin)
- Admin mode includes a **"Record" button** that captures N iterations of the simulation
- Output: a short looping video or animated image (GIF/WebM/MP4) of the simulation running
- Configurable: start frame, duration (in iterations), playback speed, output resolution
- One-click export — file downloads directly, no external tools needed
- This is the primary content creation tool for social media posting

#### P2.2 — Screenshot & share (user)
- **"Capture" button** visible in exhibit view — saves the current frame as a high-res PNG
- **Share sheet**: after capture, offer options to:
  - Download the image
  - Copy a share link (URL with scenario ID + iteration number, so the recipient sees the same frame)
  - Copy to clipboard
- Share links should produce a good social preview (Open Graph meta tags with the captured thumbnail)

#### P2.3 — Social metadata
- Dynamic OG tags per scenario: title, description, thumbnail
- Twitter card support (large image)
- Share URLs resolve to the exhibit view with the simulation paused at the shared frame

### Phase 3: The Depth (engagement)

For returning visitors and the curious — more ways to explore and connect.

#### P3.1 — Educational layer
- Each scenario can have an optional **"How it works" expandable section**
- Plain-language explanation of the rule, with a simple visual diagram if helpful
- Links to related scenarios ("If you liked this, see also...")
- This content lives behind a deliberate interaction — never auto-displayed

#### P3.2 — Collections
- Group curated scenarios into themed collections (e.g., "Conflict & Balance", "Symmetry", "Slow Drift")
- Collections have their own landing pages with a short curatorial statement
- The gallery can surface collections as a secondary navigation layer

#### P3.3 — Parameter exploration (conditional)
- If user demand warrants it: expose structural parameters (radius, grid size) behind an "Experiment" toggle
- Guard rails: show a subtle indicator when the current params are known to produce interesting results vs. uncharted territory
- This is deferred unless the concept demands it

### Phase 4: The Object (future vision — not in active development)

Bring patterns into the physical world.

#### P4.1 — Downloadable assets
- High-resolution pattern exports (PNG/SVG) suitable for printing
- Predefined "poster" aspect ratios and resolutions

#### P4.2 — Physical goods
- Sticker packs, prints, or posters featuring curated patterns
- Integration with print-on-demand service (e.g., Printful)
- This is the monetization exploration — test demand before investing

---

## 6. Visual Design System

The UI is a frame. The cellular automata are the art. Every design decision serves one question: *does the work look better because of this, or despite it?*

### Aesthetic direction: Dark Gallery Minimalism

The style combines **Exaggerated Minimalism** (bold negative space, typographic confidence, stripped-back chrome) with **OLED Dark Mode** (true black backgrounds, high contrast, minimal glow). The effect is a digital white-cube gallery inverted — black walls, the art provides all the color.

Key qualities:
- **Vast negative space.** Whitespace (blackspace) is a design element, not wasted space.
- **Near-zero chrome.** No borders, no cards with shadows, no decorative elements. The grid of thumbnails floats on black.
- **Typography does the work.** When text appears, it's confident and well-set. When it's not needed, it's absent.
- **The simulation is the only color source.** App chrome is monochromatic. All vibrancy comes from the automata themselves.

### Color palette (app chrome)

The app uses a single monochromatic palette. No theme switcher — one identity, not five.

#### Dark mode (primary — the default and signature look)

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Background | `#09090B` | `--bg` | Page background, true black |
| Surface | `#18181B` | `--surface` | Elevated areas (panels, overlays) |
| Border | `#27272A` | `--border` | Subtle dividers, only when essential |
| Text primary | `#F4F4F5` | `--text` | Headings, primary labels |
| Text secondary | `#A1A1AA` | `--text-muted` | Descriptions, metadata, counters |
| Text tertiary | `#52525B` | `--text-faint` | Timestamps, disabled states |
| Accent | `#F4F4F5` | `--accent` | Interactive affordances (white, not colored) |
| Accent hover | `#FFFFFF` | `--accent-hover` | Hover/focus states |

**Why no colored accent?** A colored accent (pink, cyan, gold) competes with the automata palettes. White-on-black is the gallery's signature. The art is the color.

#### Light mode (secondary — for accessibility, not personality)

| Role | Hex | CSS Variable |
|------|-----|-------------|
| Background | `#FAFAFA` | `--bg` |
| Surface | `#FFFFFF` | `--surface` |
| Border | `#E4E4E7` | `--border` |
| Text primary | `#09090B` | `--text` |
| Text secondary | `#52525B` | `--text-muted` |
| Text tertiary | `#A1A1AA` | `--text-faint` |
| Accent | `#18181B` | `--accent` |

Light mode is a `prefers-color-scheme: light` fallback, not a toggle. Same restraint, inverted.

### Typography

**Two families, strict roles.** Loaded from Google Fonts.

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| Display | **Space Grotesk** | 500, 700 | App name, scenario titles, hero text |
| Body | **Inter** | 400, 500 | Descriptions, labels, UI text, buttons |
| Mono | System monospace | 400 | Iteration counters, technical metadata only |

```
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&display=swap');
```

**Space Grotesk** — geometric, slightly quirky letterforms. Distinctive without being decorative. Gives "Murmur" a recognizable typographic identity. Used sparingly: the app name, scenario titles, and nothing else.

**Inter** — invisible in the best way. Optimized for screens, highly legible at small sizes. Handles all utility text so Space Grotesk stays special.

#### Type scale

| Token | Size | Line height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | `0.75rem` (12px) | 1.5 | Counters, fine metadata |
| `--text-sm` | `0.875rem` (14px) | 1.5 | Secondary labels, tags |
| `--text-base` | `1rem` (16px) | 1.6 | Body text, descriptions |
| `--text-lg` | `1.25rem` (20px) | 1.4 | Scenario titles in grid |
| `--text-xl` | `1.5rem` (24px) | 1.3 | Scenario title in exhibit |
| `--text-hero` | `clamp(2.5rem, 6vw, 4.5rem)` | 1.1 | App name, hero text |

Letter-spacing: `-0.02em` on display sizes (`--text-xl` and above). Tight tracking reinforces the minimal, confident tone.

### Spacing system

An 8px base grid. Consistent, predictable, generous.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `4px` | Tight internal gaps |
| `--space-2` | `8px` | Icon gaps, inline spacing |
| `--space-3` | `12px` | Small component padding |
| `--space-4` | `16px` | Standard padding, grid gap |
| `--space-6` | `24px` | Component spacing |
| `--space-8` | `32px` | Section padding |
| `--space-12` | `48px` | Large section margins |
| `--space-16` | `64px` | Page-level vertical rhythm |
| `--space-24` | `96px` | Hero breathing room |

### Component specifications

#### Gallery cards
```
- No border, no shadow, no border-radius
- Thumbnail fills the entire card (object-fit: cover)
- Scenario name appears below the image: Space Grotesk 500, --text-lg, --text-muted
- On hover: name shifts to --text (white), thumbnail scales subtly (1.03, 300ms ease)
- No overlay, no tags, no description on the card surface
- Cursor: pointer
- Grid gap: --space-2 (tight, mosaic-like) or --space-4 (airy, gallery-like) — test both
```

#### Exhibit view (simulator)
```
- Canvas fills the viewport (100vw x 100vh or near it)
- Controls: clustered bottom-center, semi-transparent (rgba surface + backdrop-blur)
- Controls auto-hide after 3s of no interaction, reappear on mouse move or tap
- Play/pause: single toggle icon (SVG, not text labels)
- Step forward: secondary icon
- Reset: tertiary, smaller
- All controls: 44x44px touch targets minimum
- Title: bottom-left overlay, Space Grotesk 500, --text-xl, fades with controls
- Iteration counter: bottom-right, Inter 400, --text-xs, --text-faint
- Back to gallery: top-left, simple arrow icon, always visible but low-contrast
```

#### Palette editor (Phase 1.4)
```
- Slides in from the right edge as a narrow panel (280px max)
- Dark surface (--surface) with subtle left border (--border)
- Shows current colors as swatches (circles or squares, 32x32)
- Clicking a swatch opens a native color picker or inline picker
- Preset palettes shown as horizontal rows of small swatches
- Selecting a preset applies it immediately (no confirm step)
- "Reset" link at bottom returns to scenario default
- Panel closes on outside click or Escape
```

### Responsive breakpoints

| Breakpoint | Gallery grid | Exhibit behavior |
|------------|-------------|-----------------|
| < 640px | 1 column, full-width cards | Canvas fills screen, controls at bottom |
| 640–959px | 2 columns | Same as mobile |
| 960–1279px | 3 columns | Controls overlay on canvas |
| 1280–1599px | 4 columns | Same |
| 1600px+ | 5 columns, max-width container | Same |

### Animation & motion

| Element | Duration | Easing | Property |
|---------|----------|--------|----------|
| Card hover (name) | 200ms | ease | color |
| Card hover (thumbnail) | 300ms | ease-out | transform: scale |
| Controls fade in/out | 250ms | ease | opacity |
| Panel slide | 200ms | ease-out | transform: translateX |
| Page transitions | None | — | No page transition animations |

All animations respect `prefers-reduced-motion: reduce` — disable scale transforms and slide animations, keep only opacity fades.

### Iconography

Minimal icon set, inline SVG (no icon library dependency):
- Play (triangle)
- Pause (two bars)
- Step forward (triangle + bar)
- Reset (circular arrow)
- Back arrow
- Info (circle-i)
- Close (x)
- Palette/color (circle or droplet)

Line-stroke style, 1.5px stroke, 20x20 viewBox. White (`currentColor`) on dark backgrounds.

### What we're removing from the current design

| Current | Replacement |
|---------|-------------|
| 5 CSS themes + theme switcher | Single dark palette, light via `prefers-color-scheme` |
| Courier New monospace everywhere | Space Grotesk (display) + Inter (body) |
| Hover overlays with tags + description | Name only below card, info on click |
| Color table in simulator | Hidden by default, behind info toggle |
| Prominent iteration counter | Small, faint, bottom-right |
| Text-labeled buttons (Start, Pause, Reset) | Icon-only controls with tooltips |
| Radial gradient background glows | Flat black (`#09090B`) |
| 2px grid gap | Wider gap, tested between 8-16px |

---

## 7. Design Principles

| Principle | Implication |
|-----------|-------------|
| Show, don't explain | The gallery has no tutorial. The first thing you see is a beautiful pattern. |
| Curate ruthlessly | 8-12 scenarios on the public gallery, not 35. |
| Reveal progressively | Name → simulation → description → rule explanation → parameters. Each layer is opt-in. |
| Respect the medium | These are living patterns, not static images. The simulation *running* is the art. |
| Design for the screenshot | Every state of the UI should look good if someone takes a screenshot. |
| Quiet UI | Controls, labels, and chrome should never compete with the cellular automata itself. |

---

## 8. Success Metrics

### Phase 1
- Gallery bounce rate < 40% (visitors explore beyond the landing)
- Average scenarios viewed per session > 3
- Qualitative: "this looks beautiful" is the first reaction

### Phase 2
- Content creation time < 2 minutes per social clip (admin workflow)
- User-initiated captures/shares per week (growth signal)
- Social media impressions on posted content

### Phase 3
- Return visit rate > 15%
- Time spent on educational content (engagement depth)

---

## 9. Technical Constraints & Decisions

- **No frameworks, no build tools.** The vanilla JS + ES modules architecture stays. It's a feature, not a limitation — keeps the project fast, simple, and portable.
- **No backend.** Everything runs client-side. Curation metadata, user preferences, and color customizations use localStorage or static config files.
- **Admin mode is client-side.** A URL parameter or localStorage flag — not authentication. The "admin" is the project owner working locally.
- **Export pipeline is browser-native.** Canvas API for screenshots, MediaRecorder API or frame-by-frame canvas capture for video. No server-side rendering.
- **Mobile is first-class** but the primary experience is desktop (larger canvas, richer interaction). Mobile should be beautiful and functional, not a degraded experience.

---

## 10. Open Questions

1. **Name**: Final selection from candidates (or new suggestions).
2. **Hero piece**: Should the gallery hero be a fixed "best of" or rotate? Auto-play or static?
3. **Curation count**: How many of the 35 scenarios make the first curated cut? (Suggested: 8-12)
4. **Video format**: GIF (universal but large/lossy) vs. WebM (small, good quality, not universal) vs. MP4 (universal, requires encoding library)?
5. **Domain**: Secure a domain early if the name is decided. Availability should factor into the name choice.
6. **Grid gap**: Tight mosaic (8px) or airy gallery (16px)? Needs visual testing with real thumbnails.
7. **Controls auto-hide timing**: 3 seconds proposed — may need adjustment based on feel.

---

## 11. Phasing Summary

| Phase | Theme | Key Deliverable | Dependency |
|-------|-------|-----------------|------------|
| **1** | The Gallery | Curated, beautiful gallery + redesigned exhibit view + color customization | None |
| **2** | The Share | Admin clip export + user screenshot/share + social metadata | Phase 1 |
| **3** | The Depth | Educational content + collections + optional param exploration | Phase 1 |
| **4** | The Object | Downloadable assets + physical goods exploration | Phase 2 |
