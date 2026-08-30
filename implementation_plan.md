# Wasteland Portfolio — Implementation Plan (FINAL)

7 Deadly Sins. 7 Projects. 7 Stations through hell. Then transcendence.

---

## All Decisions Locked ✅

| Decision | Answer |
|----------|--------|
| Name | SAURAV KUMAR |
| Title | Full Stack Developer · Applied AI Engineer · Creative Developer & AI Builder |
| Narrative | **7 Deadly Sins** — each sin maps to a project and a stage of rejection |
| Waypoints | **7** |
| Loading screen | **Hybrid** — Emergency Broadcast (Fallout) → Sandstorm Reveal (Mad Max) |
| Company names | Private — show projects only |
| Old portfolio | Linked inside Wrath waypoint + contact section |
| Contact section | **Yes** — after finale |
| Resume download | **Yes** |

---

## The 7 Deadly Sins — Narrative Map

| # | Sin | Project | Description (wasteland tone) |
|---|-----|---------|------------------------------|
| W1 | **PRIDE** | Finger Mouse (2024) | *"My first real creation. I taught a webcam to read hands — 5 gesture modes, <100ms latency. I was proud. I thought this was enough."* |
| W2 | **GREED** | CampusMart (2025) | *"One project wasn't enough. I wanted more. Built an entire delivery platform. Real vendors. Real UPI payments. Same-hour delivery. I wanted it all."* |
| W3 | **GLUTTONY** | AI Chatbot for FAQs (2026) | *"I couldn't stop consuming. More frameworks. More architectures. Hand-rolled NLP from scratch. 23 automated tests. Zero dependencies. I devoured everything."* |
| W4 | **LUST** | Sentiment Analysis Dashboard (2026) | *"I craved their approval. 95.6% accuracy. Production ML pipeline. Interactive dashboards. 6 evaluation visuals. I built what I thought they desired."* |
| W5 | **ENVY** | Object Detection & Tracking (2026) | *"YOLOv8. Deep SORT. 80-class real-time detection. Full-stack dashboard with live charts. I watched others get hired with half this work. The envy burned deeper than the wasteland."* |
| W6 | **WRATH** | LinguaFlow AI + Old Portfolio (2026) | *"Neural translation. Dual API fallback. Voice input. 5 tone modes. Deployed live. Then I built an entire portfolio in rage — [see it burn](https://saurav-ggd-portfolio.vercel.app/). I stopped building for them. I built for myself."* |
| W7 | **SLOTH** | WhatsApp Automator | *"They called me lazy. So I automated their work. Message scheduling. Bulk messaging. Hours of their labor — done in seconds. Who's lazy now?"* |
| **FINALE** | **TRANSCENDENCE** | — | *"I walked through all seven sins. I burned through every rejection. And I'm still here — levitating above the ashes, with AI in my hands. Still standing. Still building. Still powerful."* |

---

## Proposed Changes

---

### Phase 1 — Loading Screen: Emergency Broadcast → Sandstorm Reveal

#### [NEW] [LoadingScreen.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/LoadingScreen.jsx)

**Stage 1 — Emergency Broadcast (~2.5s)** *(Fallout / The Road)*
- CRT TV effect: scanlines, static noise, color distortion
- Emergency broadcast bar: `⚠ EMERGENCY BROADCAST SYSTEM`
- Glitching typewriter: `"THIS IS NOT A DRILL"`
- `"SIGNAL LOST"` — screen corrupts → CRT flicker → black

**Stage 2 — Sandstorm Reveal (~2.5s)** *(Mad Max: Fury Road)*
- Dense brown sandstorm + embers fill screen
- `SAURAV KUMAR` appears massive, barely visible in haze
- Storm clears center-outward → particles scatter
- 3D wasteland revealed underneath → ready to walk

**Tech**: HTML/CSS/JS overlay on R3F Canvas. CRT via CSS filters + scanline overlay. Static noise via small animated canvas. Sandstorm via CSS-animated particles. ~5s total, then unmounts.

#### [MODIFY] [App.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/App.jsx)
- Loading state → LoadingScreen → fade out → enable scroll

---

### Phase 2 — Content Population

#### [MODIFY] [sections.js](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/config/sections.js)
- 7 waypoints with the exact sin/project/description mapping above
- Each waypoint has: `id`, `fraction`, `sin`, `emotion` (sin name), `title` (project), `body` (narrative desc), `portrait` (AI image), `tags` (tech stack), `github` link
- Fractions evenly spaced: ~0.12, 0.24, 0.36, 0.48, 0.60, 0.72, 0.84
- W6 (Wrath) includes `portfolioLink: 'https://saurav-ggd-portfolio.vercel.app/'`
- Update `TOTAL_DEPTH` to 180 (longer path for 7 waypoints)

#### [MODIFY] [App.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/App.jsx)
- Hero: `SAURAV KUMAR` + `Full Stack Developer · Applied AI Engineer`
- Tagline: *"I built everything they asked for. They still said no."*
- Finale: *"Still standing. Still building. Still powerful."*
- Stats: `13+ Certifications · 7 Projects · Graduating 2027`
- `SCROLL_PAGES` → 14 (more scroll for 7 waypoints + finale)
- Contact section after finale (GitHub, LinkedIn, Instagram, Email, Resume, Old Portfolio)

#### [MODIFY] [index.html](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/index.html)
- Title: "Saurav Kumar — The Wasteland Portfolio"
- Meta description, Open Graph tags
- Google Fonts: Inter + Bebas Neue
- Preload critical assets

---

### Phase 3 — Wasteland Environment Overhaul

#### [MODIFY] [Wasteland.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/Wasteland.jsx)
- **12+ backdrop layers** using best frames from source-frames directories
- Varied scale/x-offset for parallax depth
- **Ruin corridor walls** — dark vertical planes creating ruins on left/right
- **Textured ground** — cracked/burnt earth
- **6-8 fire-colored point lights** along path (pulsing, warm tones)
- Update `PATH_DEPTH` to 180

#### [MODIFY] [Embers.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/Embers.jsx)
- 900 → 2500 particles
- **Dual types**: orange/red embers (rising) + grey ash (floating/falling)
- Random size variation (0.03–0.12)
- Color variation: `#ff9648`, `#ff4500`, `#ffcc33`, `#ff6b35`

#### [NEW] [FirePillars.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/FirePillars.jsx)
- 8-10 fire columns along the path
- Each = vertical particle cluster + flickering point light
- Random x-positions (±5-10 from center)

#### [MODIFY] [Scene.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/Scene.jsx)
- Add FirePillars
- Bloom: 0.9 → 1.2
- Add subtle DepthOfField
- Adjust fog for longer path

---

### Phase 4 — AI Portrait Generation

#### [GENERATE] 7 portraits + 1 finale figure:
| # | Sin | Image Description | Style |
|---|-----|-------------------|-------|
| 1 | Pride | Figure standing tall over their creation, ember glow | Dark cinematic, brownish-orange |
| 2 | Greed | Figure reaching for more, hands grasping, surrounded by blueprints | Same palette |
| 3 | Gluttony | Figure overwhelmed by code/knowledge, drowning in screens | Same palette |
| 4 | Lust | Figure reaching toward a distant glowing approval, desperate | Same palette |
| 5 | Envy | Figure watching a glowing city they can't reach | Same palette |
| 6 | Wrath | Figure in rage, fire around them, fists clenched | More red/intense |
| 7 | Sloth | Figure sitting but automated machines work around them | Same palette |
| 8 | Finale | Levitating figure, arms wide 65°, backlit, embers rising | Most dramatic |

Save to `src/assets/portraits/{sin}.png` + `src/assets/portraits/finale.png`

#### [MODIFY] [GriefPortrait.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/GriefPortrait.jsx)
- Rename to `SinPortrait.jsx` (better naming for 7 sins)
- Emissive glow behind portrait
- Breathing/floating animation
- Alternate left/right placement per waypoint
- Larger size for emotional impact

---

### Phase 5 — Finale Figure & Logos

#### [MODIFY] [FinaleFigure.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/FinaleFigure.jsx)
- Replace capsule with Billboard + generated finale image
- Enhanced levitation float + subtle rotation
- Ground glow pool beneath figure
- Rising energy particles from ground

#### Logo Emblems:
- **Left hand**: Claude AI — orange glow symbol + orbiting particles
- **Right hand**: Antigravity IDE — blue-white glow symbol + orbiting particles
- Both contribute to Bloom post-processing

---

### Phase 6 — UI Polish & Final Tuning

#### [MODIFY] [WaypointText.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/WaypointText.jsx)
- Bebas Neue for sin name + project title
- Inter for description body
- Tech tags as styled pills
- GitHub link per project
- Sin number indicator (I – VII in Roman numerals)
- Backdrop blur for readability

#### [MODIFY] [ScrollCameraRig.jsx](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/components/ScrollCameraRig.jsx)
- Mouse-parallax: ±3° head-turn based on cursor position
- Enhances walking immersion

#### [MODIFY] [index.css](file:///home/sauravkumar/Desktop/new%20pf/portfolio-3d/src/index.css)
- Import Inter + Bebas Neue
- Custom scrollbar (thin, dark, ember-orange thumb)
- `::selection` in ember orange
- Font smoothing

#### Performance
- Halve particles on mobile (`window.innerWidth < 768`)
- Lazy-load portrait textures
- Test all viewport sizes
- Verify FPS > 30

---

## Verification Plan

### Manual Testing
1. Loading screen plays → broadcast → sandstorm → wasteland revealed
2. All 7 sin waypoints render with portraits, text, and correct pacing
3. W6 (Wrath) shows old portfolio link
4. Finale levitation with glowing logos
5. Contact section with all links
6. Responsive across common viewport sizes
7. Zero "REPLACE" text anywhere
8. FPS > 30 on standard hardware

### Build
```bash
npm run build
npm run preview
```
