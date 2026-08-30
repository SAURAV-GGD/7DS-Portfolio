# Wasteland Portfolio — Phase 1 scaffold

## What's here
A working scroll-driven 3D "walk forward through the wasteland" experience:
- Camera dollies forward along -z as you scroll (not a vertical pan)
- Layered ruin/archway backdrop planes (from your Set 1 frames) + fog for depth
- Ember/ash particle field drifting past the camera
- 4 waypoint sections with a placeholder grief portrait + text panel, spaced
  along the walk (src/config/sections.js)
- Finale section: placeholder levitating figure with glowing hand emblems

## Run it
    npm install
    npm run dev

## Deploy
    vercel

## What YOU need to swap in (all marked "REPLACE" in the code)
1. `src/config/sections.js` — your 4 real project titles/descriptions +
   your actual AI-generated grief/pain/sadness/envy portraits
   (drop images in `src/assets/portraits/`)
2. `src/App.jsx` — your name + hero line, finale closing line
3. `src/components/FinaleFigure.jsx` — currently a primitive capsule-mesh
   stand-in for your levitating figure. Once you have your final pose
   render, easiest path is to replace this whole component with a
   `<Billboard>` + textured plane (same pattern as GriefPortrait.jsx),
   or a transparent PNG cutout if you want it to look embedded in the
   scene from any angle. The Claude / Antigravity glowing logos are
   icosahedron placeholders at each hand — swap for logo textures the
   same way.
4. `SCROLL_PAGES` in `src/App.jsx` (currently 9) — controls how much
   scrolling it takes to walk the whole path. Tune to taste.
5. `WAYPOINTS[].fraction` in `sections.js` — where each moment sits
   along the 0..1 walk. Currently spaced ~0.16 apart.

## Source frames
Your two original frame sequences are included under
`source-frames-zip1/` and `source-frames-zip2/` (50 frames each) in case
you want to pull different frames than the ones currently wired in.

## Notes on the "3D" approach
There's no literal 3D city model here — that would need real 3D assets
(terrain, ruin geometry) which is a much bigger undertaking. Instead the
wasteland is built from your 2D frames as depth-layered planes under fog,
viewed through a locked forward-moving camera — this reads as a 3D walk
without needing a 3D artist. If you later get access to actual 3D ruin
models (Sketchfab, etc.), Wasteland.jsx is the only file that needs
rework to swap planes for real geometry.
