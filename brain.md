# 🧠 Brain — Wasteland Portfolio

> Single source of truth for this project. Everything I know about Saurav, his work, the codebase, and the vision.
> **Last updated**: 2026-08-30 — includes resume data extraction

---

## 🤖 HANDOFF PROMPT (for any AI agent picking this up)

> **READ THIS FIRST if you're a new agent continuing this project.**
>
> You're building **Saurav Kumar's 3D Wasteland Portfolio** — a scroll-driven, first-person walk through a burning post-apocalyptic city built with **React Three Fiber + Vite**.
>
> **Narrative**: The 7 Deadly Sins. Each sin = a real project Saurav built for companies/interviews but still didn't get hired. The walk ends with a **levitation finale** — Saurav floating above the ashes with Claude AI and Antigravity IDE logos glowing in his hands. Theme: rejection → transcendence.
>
> **Key files**:
> - `implementation_plan.md` — the full 6-phase build plan (in this same artifact directory)
> - `task.md` — tracks current progress (in this same artifact directory)
> - `src/config/sections.js` — the 7 waypoint definitions
> - `src/components/Scene.jsx` — the R3F canvas and post-processing
> - `src/components/Wasteland.jsx` — the 3D environment
> - `src/App.jsx` — root component with scroll mechanics + HTML overlays
>
> **Stack**: React 19, Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, GSAP, Vite 8
>
> **The old portfolio** is cloned at `.old-portfolio-ref/` for data reference. Resume PDF is at `src/assets/Saurav_Kumar_Resume-1 (1).pdf`.
>
> Read the full brain.md below, then check task.md for where things left off.

---

## 👤 Identity

| Field | Value |
|-------|-------|
| **Name** | Saurav Kumar |
| **Display** | SAURAV KUMAR |
| **Location** | Bihar ↔ Jaipur, India |
| **Education** | B.Tech CSE, Arya College of Engineering, Jaipur (2027) |
| **GitHub** | [@SAURAV-GGD](https://github.com/SAURAV-GGD) |
| **Instagram** | [@_sxurv_](https://www.instagram.com/_sxurv_/) |
| **LinkedIn** | [saurav-kumar-608b2b2a5](https://www.linkedin.com/in/saurav-kumar-608b2b2a5) |
| **Email** | sauravggd@gmail.com |
| **Phone** | +91 7004239911 |
| **Old Portfolio** | [saurav-ggd-portfolio.vercel.app](https://saurav-ggd-portfolio.vercel.app/) |
| **Title** | Full Stack Developer · Applied AI Engineer · Creative Developer & AI Builder |

### Traits
- 🧠 AI-first thinker
- ⚡ Rapid prototyper
- 🏋️ Competitive lifter (inter-college weightlifting)
- 🎓 CSE student graduating 2027
- 🚀 Ships fast
- 🤝 Junior mentor

### Bio (from old portfolio)
> "I don't just write code from scratch; I orchestrate AI tools to ship real, working products at insane speed. From computer vision tools to hyperlocal delivery apps — I build things that actually work. My edge is using AI-assisted development to go from idea to prototype in hours, not weeks."

### Objective (from resume)
> "Final year B.Tech CSE student and AI-powered builder who ships real products using Python, LLMs, and modern tooling. Built computer vision systems achieving <100ms real-time latency, an NLP chatbot and ML sentiment-analysis pipeline (~95.6% accuracy), a YOLOv8 + Deep SORT object-tracking dashboard, and a full-stack neural translation platform. Seeking product-based company and MNC roles where speed, ownership, and AI literacy matter."

---

## 💼 Projects (ALL — from portfolio + resume)

### 1. Finger Mouse ⭐ FEATURED
- **Desc**: Real-time gesture-controlled virtual touchpad via webcam. 21-landmark hand-tracking pipeline achieving <100ms latency. 5 gesture modes — cursor, left/right click, drag-and-drop, two-finger scroll. Zero hardware needed.
- **Tech**: Python, MediaPipe, OpenCV, PyAutoGUI
- **GitHub**: https://github.com/SAURAV-GGD/Finger-Mouse
- **Year**: 2024

### 2. CampusMart ⭐ FEATURED
- **Desc**: Hyperlocal quick-commerce delivery platform targeting Arya College students. Flat ₹10 delivery fee, UPI-based payments, same-hour delivery. Onboarded 4 pilot vendor shops in the first month. AI-accelerated development cut build time by ~60%.
- **Tech**: React, Node.js, UPI Integration, REST APIs
- **Year**: 2025

### 3. AI Chatbot for FAQs ⭐ NEW (HorizonTechX)
- **Desc**: Zero-dependency NLP chatbot from scratch. Hand-rolled TF-IDF + cosine-similarity intent-matching engine with confidence-threshold fallback. 23-test automated suite. CLI + Flask web interface. JSON REST endpoint (POST /api/chat) for third-party integration. 12 FAQs across 55 alternate phrasings, 7 topic categories.
- **Tech**: Python, NLP, TF-IDF, Cosine Similarity, Flask
- **GitHub**: https://github.com/SAURAV-GGD/HorizonTechX_Chatbot-NLP
- **Year**: 2026

### 4. Sentiment Analysis Dashboard ⭐ NEW (HorizonTechX)
- **Desc**: TF-IDF + Logistic Regression sentiment classifier. ~95.6% test accuracy (per-class F1 up to 0.97) on 1,800-sample dataset across 3 text sources. Interactive Streamlit dashboard for live predictions and batch CSV analysis. 6 automated evaluation visuals (confusion matrix, sentiment distribution, word clouds, etc.).
- **Tech**: Python, scikit-learn, Streamlit, Logistic Regression, TF-IDF
- **GitHub**: https://github.com/SAURAV-GGD/HorizonTechX_Sentiment-Analysis
- **Year**: 2026

### 5. Real-Time Object Detection & Tracking ⭐ NEW (HorizonTechX)
- **Desc**: Full-stack computer-vision app. YOLOv8 (80-class real-time detection) + Deep SORT for persistent multi-object ID tracking. Streaming annotated video via FastAPI/MJPEG backend to a live React + Chart.js dashboard (FPS, object counts, per-class breakdowns). Dual input modes (webcam + video upload), adjustable confidence slider, per-class filtering.
- **Tech**: YOLOv8, Deep SORT, FastAPI, React, Chart.js, OpenCV
- **GitHub**: https://github.com/SAURAV-GGD/HorizonTechX_Object-Detection-and-Tracking-opencv
- **Year**: 2026

### 6. LinguaFlow AI — Neural Translation Platform ⭐ NEW (HorizonTechX)
- **Desc**: Production-style translation web app. Dual-provider API fallback (MyMemory + LibreTranslate). Auto language detection, voice input, text-to-speech, 5 tone-adjustment modes, 50-entry local history cache. Secure server-side API routes on Next.js 15 App Router. Glassmorphic dark/light theme UI. Deployed on Vercel.
- **Tech**: Next.js 15, TypeScript, Tailwind CSS, Vercel
- **GitHub**: https://github.com/SAURAV-GGD/HorizonTechX_Language-Translation-Tool
- **Live**: saurav-ggd-translation.vercel.app
- **Year**: 2026

### 7. WhatsApp Automator
- **Desc**: Group automation tool using Selenium — handles message scheduling, bulk messaging, and group management. Saves hours of manual work.
- **Tech**: Python, Selenium, Automation, Browser Control
- **GitHub**: https://github.com/SAURAV-GGD

---

## 🎓 Certifications & Job Simulations (13+)

| # | Title | Issuer | Date |
|---|-------|--------|------|
| 1 | Data Analytics Job Simulation | Deloitte Australia × Forage | Mar 2026 |
| 2 | Software Engineering Job Simulation | JPMorgan Chase × Forage | 2026 |
| 3 | Solutions Architecture Job Simulation | AWS × Forage | Dec 2026 |
| 4 | Engineer AI Agents with Agent Development Kit (ADK) | Google Cloud | 2026 |
| 5 | Build Real World AI Apps with Gemini & Imagen | Google Cloud | Apr 2025 |
| 6 | Develop GenAI Apps with Gemini and Streamlit | Google Cloud | May 2026 |
| 7 | Prompt Design in Vertex AI | Google Cloud | Apr 2025 |
| 8 | Develop Your Google Cloud Network | Google Cloud | May 2026 |
| 9 | Deploy Kubernetes Applications on Google Cloud | Google Cloud | Apr 2025 |
| 10 | Set Up an App Dev Environment on Google Cloud | Google Cloud | Apr 2025 |
| 11 | Get Started with Google Workspace Tools | Google Cloud | Apr 2025 |
| 12 | Encoder-Decoder Architecture | Google Cloud | Sep 2024 |
| 13 | AI for You: Training and Assessment | Oracle | 2025 |

---

## 💼 Experience

| Period | Role | Company | Key Highlights |
|--------|------|---------|----------------|
| May–Jun 2026 | AI/ML Intern (Project-Based) | **HorizonTechX** (Remote) | Delivered 4 independent AI/ML products (NLP, ML, CV, full-stack) in a 4-week sprint. All open-sourced with full docs & tests. |
| 2025 | Data Analytics Intern | **Codveda Technologies** (Remote) | EDA on 3+ real-world datasets. Pandas/NumPy pipelines. 100% deliverable timelines met. |
| 2023 – Present | Event Coordinator & Junior Mentor | **Arya College of Engineering** | Trained 20+ students, managed 100+ participant events. |

---

## 🛠️ Skills (from resume — definitive)

| Category | Technologies |
|----------|-------------|
| **Languages** | Python, JavaScript, TypeScript, SQL, HTML, CSS, Java (basic) |
| **AI / ML / NLP / CV** | MediaPipe, OpenCV, YOLOv8, Deep SORT, NLP (TF-IDF, Cosine Similarity), NumPy, Pandas, scikit-learn, Logistic Regression, PyAutoGUI, TensorFlow (learning) |
| **Generative AI** | Gemini API, Imagen, Vertex AI, Prompt Engineering, Claude API |
| **Cloud & Infra** | Google Cloud Platform, AWS (basics), Vercel, Flask, FastAPI, REST APIs |
| **Web & Backend** | React, Next.js, Node.js (basic), Selenium, Spring Framework (basic), Apache Kafka (basic) |
| **Tools** | Git, GitHub, VS Code, Figma, Jupyter Notebook, Streamlit, Tableau, Excel, Claude Code, Cursor IDE |
| **Database** | MongoDB, Supabase, Firebase |
| **Blockchain** | Blockchain Concepts, Decentralized Storage, Smart Contracts (basics) |

### Top Languages
- Python: 52%
- JavaScript: 22%
- TypeScript: 12%
- C++: 8%
- HTML/CSS: 4%
- Java: 2%

---

## 🏆 Leadership & Activities

- **Organized Arya College Rampwalk 2025** — Netflix-themed cosplay event, built custom PPT + 16 AI-generated intro videos
- **Junior Mentor & Event Coordinator** — trained 20+ incoming students in technical events; managed 100+ participant college-wide programmes
- **Open-Source Contributor** — maintains public GitHub repos with READMEs, version control, fix issues/bugs, installation guides
- **Runner-Up, Inter-College Weightlifting Competition** — discipline and consistency under competitive pressure 🏋️
- **Mr. Fresher Runner-Up** — recognized for confidence and communication among 300+ participants

---

## 🎨 The Vision — Wasteland Portfolio

### Concept
A 3D post-apocalyptic wasteland that tells Saurav's story — all the work, prototypes, and interview projects he built but still didn't get the job. The grief, pain, sadness, and envy are real emotions from the rejection cycle.

### Narrative Flow (scroll-driven walk)
1. **Landing / Hero**: Brown/burnt wasteland. Everything burning. Ashes and fire sparkles in the air. City destroyed. Name + tagline fade in.
2. **Walk Forward**: Scrolling = walking forward through the ruins (first-person perspective, NOT vertical scroll feel). Camera bobs like walking.
3. **Waypoint 1 — GRIEF**: AI-generated portrait of Saurav sitting in grief. Shows a project/prototype built for a company interview → didn't get the job.
4. **Waypoint 2 — PAIN**: Another portrait in pain. Another project, another rejection.
5. **Waypoint 3 — SADNESS**: Portrait in deep sadness. More professional work unrecognized.
6. **Waypoint 4 — ENVY**: Portrait consumed by envy. Watching others get what he worked for.
7. **Finale — LEVITATION**: Saurav's figure levitating 2-3 feet off the ground, arms wide open at 60-70°. Claude logo glowing in one hand, Antigravity IDE logo in the other — showing the superpowers. The message: still standing, still building, still powerful.

### Emotional Core
> "I built all these prototypes and ideas for companies, interviewed, gave it my all — and still didn't get the job. That's what the grief and sadness is about. But I'm still here, still building, with AI as my superpower."

### Key Design Decisions
- **Company names stay private** — show the projects, not the companies
- **Number of waypoints**: TBD after reviewing what projects to feature (user wants to decide)
- **Brownish theme** throughout — burnt earth, ash, embers
- **Fire and ashes** are critical atmospheric elements
- **Walking perspective** — must feel like first-person walking, not scrolling

---

## 📁 Current Codebase Architecture

### Stack
- **React 19** + **React Three Fiber** (r3f) for 3D
- **Three.js** for 3D primitives
- **@react-three/drei** for helpers (Billboard, useTexture)
- **@react-three/postprocessing** for Bloom + Vignette
- **GSAP** (installed but unused currently)
- **Vite 8** for build
- **No CSS framework** — vanilla CSS + inline styles

### File Map

```
portfolio-3d/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx                    # Entry point
│   ├── App.jsx                     # Root — scroll spacer + HTML overlays
│   ├── index.css                   # Minimal global reset
│   ├── config/
│   │   └── sections.js             # WAYPOINTS array + TOTAL_DEPTH
│   ├── hooks/
│   │   ├── useScrollProgress.js    # Smoothed 0..1 ref for camera
│   │   └── useScrollFraction.js    # Reactive 0..1 state for HTML fades
│   ├── components/
│   │   ├── Scene.jsx               # R3F Canvas + postprocessing
│   │   ├── ScrollCameraRig.jsx     # Camera dolly + walking bob/sway
│   │   ├── Wasteland.jsx           # Layered planes + fog + lights
│   │   ├── Embers.jsx              # 900 particle ember field
│   │   ├── GriefPortrait.jsx       # Billboard portrait at waypoints
│   │   ├── FinaleFigure.jsx        # Placeholder capsule levitation
│   │   └── WaypointText.jsx        # HTML text overlay per waypoint
│   └── assets/
│       ├── hero.png
│       ├── wasteland/
│       │   ├── layer-bg.jpg        # Ruin backdrop texture
│       │   └── layer-embers.jpg    # Ember overlay texture
│       └── portraits/
│           ├── placeholder-01.jpg
│           └── placeholder-02.jpg
├── source-frames-zip1/ (50 frames)
└── source-frames-zip2/ (50 frames)
```

### What Works
- ✅ Scroll-driven camera dolly along -z
- ✅ Walking bob + sway animation
- ✅ Ember particle field (900 particles, additive blending)
- ✅ Fog system (brown haze)
- ✅ Bloom + Vignette post-processing
- ✅ 4 waypoint text overlays with fade in/out
- ✅ Billboard portraits at waypoints
- ✅ Finale capsule placeholder with levitation float

### What's Placeholder / Broken
- ❌ All text says "REPLACE: ..."
- ❌ Portraits are generic placeholder JPGs
- ❌ Wasteland is only 2 repeating textures — not immersive
- ❌ No fire/flame effects (only small ember dots)
- ❌ Finale figure is a primitive capsule, not a real render
- ❌ Logo emblems are icosahedron dots, not real logos
- ❌ No contact section, no social links, no resume download
- ❌ Ground is a flat dark plane — no texture, no rubble feel
- ❌ Missing destroyed city buildings/ruins geometry
- ❌ No loading screen / boot sequence
- ❌ No sound design (optional but powerful)
- ❌ Title tag says "portfolio-3d" — no SEO

---

## 🔗 Source Reference
- **Old portfolio repo**: cloned to `.old-portfolio-ref/`
- **Source frames**: 100 frames across `source-frames-zip1/` and `source-frames-zip2/` — wasteland sequence stills
