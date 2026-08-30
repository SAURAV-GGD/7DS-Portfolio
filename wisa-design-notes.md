# WISA-inspired redesign notes

## Reference direction

The uploaded reference is a cinematic football editorial landing page: a full-bleed photograph, black top navigation, restrained white typography, compact utility copy, and a bottom-left headline paired with a rectangular CTA. The visual language depends on image contrast, soft dark overlays, generous negative space, and a minimal navigation rail.

## Existing asset findings

- `source-frames-zip1/ezgif-frame-001.jpg` is a 1920x1080 cinematic wasteland frame with strong warm rust, ember orange, and deep brown tones. The existing frame sequence can provide a premium full-bleed background that is already consistent with the portfolio narrative.
- `src/assets/hero.png` is a small transparent purple/gray geometric mark. It is better suited to a compact logo/detail treatment than as a full hero image.
- The repository already has 100-frame sequences in `source-frames-zip1` and `source-frames-zip2`; the redesign should use these as a scroll-scrubbed background layer rather than introducing new heavyweight media.

## Planned visual system

- Palette: near-black charcoal `#080807`, warm ivory `#f4f1ea`, muted stone `#a4a19a`, and burnt orange `#d56b3f` for active states.
- Typography: condensed display face for oversized portfolio statements; neutral sans-serif for navigation and supporting copy; uppercase labels with generous tracking.
- Layout: fixed transparent nav with logo at left, centered navigation links, and a light rectangular action button at right; hero copy anchored to the lower-left; supporting descriptor anchored to the upper-right; lower-right action card with arrow icon.
- Scrolling: use a long scroll track with a damped frame-scrub background, parallax copy, section transitions, project rail cards, and a final contact section. Keep all essential motion behind `prefers-reduced-motion: no-preference`.
- Content: preserve the existing seven portfolio projects and social/resume links, but present them as selected work rather than a 3D seven-sins walkthrough.
