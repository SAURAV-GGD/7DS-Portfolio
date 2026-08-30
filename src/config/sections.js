// ─── 7 DEADLY SINS — waypoint config ────────────────────────────
// Each sin maps to a real project Saurav built, with an emotional
// narrative that tells the story of building, interviewing, and
// getting rejected — then rising above it all.

// TOTAL_DEPTH must match Wasteland's PATH_DEPTH — the camera travels
// from z=0 to z=-TOTAL_DEPTH over the full scroll length.
export const TOTAL_DEPTH = 180

// Roman numeral labels for each sin
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']

// fraction: 0 (start of walk) .. 1 (end of walk) — where along the path
// this moment sits. 7 waypoints spaced evenly.
export const WAYPOINTS = [
  {
    id: 'sin-1',
    fraction: 0.12,
    numeral: ROMAN[0],
    sin: 'PRIDE',
    title: 'Finger Mouse',
    portrait: 'pride',
    body: 'My first real creation. I taught a webcam to read hands — 5 gesture modes, <100ms latency, zero hardware. I was proud. I thought this was enough.',
    tags: ['Python', 'MediaPipe', 'OpenCV', 'PyAutoGUI'],
    github: 'https://github.com/SAURAV-GGD/Finger-Mouse',
    year: '2024',
  },
  {
    id: 'sin-2',
    fraction: 0.24,
    numeral: ROMAN[1],
    sin: 'GREED',
    title: 'CampusMart',
    portrait: 'greed',
    body: "One project wasn't enough. I wanted more. Built an entire delivery platform. Real vendors. Real UPI payments. Same-hour delivery. AI cut my build time by 60%. I wanted it all.",
    tags: ['React', 'Node.js', 'UPI Integration', 'REST APIs'],
    github: 'https://github.com/SAURAV-GGD',
    year: '2025',
  },
  {
    id: 'sin-3',
    fraction: 0.36,
    numeral: ROMAN[2],
    sin: 'GLUTTONY',
    title: 'AI Chatbot for FAQs',
    portrait: 'gluttony',
    body: "I couldn't stop consuming. More frameworks. More architectures. Hand-rolled NLP from scratch. TF-IDF + cosine similarity. 23 automated tests. Zero dependencies. I devoured everything.",
    tags: ['Python', 'NLP', 'TF-IDF', 'Flask'],
    github: 'https://github.com/SAURAV-GGD/HorizonTechX_Chatbot-NLP',
    year: '2026',
  },
  {
    id: 'sin-4',
    fraction: 0.48,
    numeral: ROMAN[3],
    sin: 'LUST',
    title: 'Sentiment Analysis',
    portrait: 'lust',
    body: 'I craved their approval. 95.6% accuracy. Production ML pipeline. Interactive Streamlit dashboard. 6 evaluation visuals. I built what I thought they desired.',
    tags: ['Python', 'scikit-learn', 'Streamlit', 'TF-IDF'],
    github: 'https://github.com/SAURAV-GGD/HorizonTechX_Sentiment-Analysis',
    year: '2026',
  },
  {
    id: 'sin-5',
    fraction: 0.60,
    numeral: ROMAN[4],
    sin: 'ENVY',
    title: 'Object Detection & Tracking',
    portrait: 'envy',
    body: 'YOLOv8. Deep SORT. 80-class real-time detection. Full-stack dashboard with live charts. I watched others get hired with half this work. The envy burned deeper than the wasteland.',
    tags: ['YOLOv8', 'Deep SORT', 'FastAPI', 'React'],
    github: 'https://github.com/SAURAV-GGD/HorizonTechX_Object-Detection-and-Tracking-opencv',
    year: '2026',
  },
  {
    id: 'sin-6',
    fraction: 0.72,
    numeral: ROMAN[5],
    sin: 'WRATH',
    title: 'LinguaFlow AI',
    portrait: 'wrath',
    body: 'Neural translation. Dual API fallback. Voice input. 5 tone modes. Deployed live. Then I built an entire portfolio in rage. I stopped building for them. I built for myself.',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    github: 'https://github.com/SAURAV-GGD/HorizonTechX_Language-Translation-Tool',
    portfolioLink: 'https://saurav-ggd-portfolio.vercel.app/',
    liveLink: 'https://saurav-ggd-translation.vercel.app/',
    year: '2026',
  },
  {
    id: 'sin-7',
    fraction: 0.84,
    numeral: ROMAN[6],
    sin: 'SLOTH',
    title: 'WhatsApp Automator',
    portrait: 'sloth',
    body: "They called me lazy. So I automated their work. Message scheduling. Bulk messaging. Hours of their labor — done in seconds. Who's lazy now?",
    tags: ['Python', 'Selenium', 'Automation'],
    github: 'https://github.com/SAURAV-GGD',
    year: '2025',
  },
]

// Finale sits past the last waypoint — the levitating figure moment.
export const FINALE_FRACTION = 0.95
