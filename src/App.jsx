import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Lenis from 'lenis'
import Scene from './components/Scene'
import LoadingScreen from './components/LoadingScreen'
import WaypointText from './components/WaypointText'
import EditorialHUD from './components/EditorialHUD'
import MobileViewToggle from './components/MobileViewToggle'
import MagneticCursor from './components/MagneticCursor'
import { useAtmosphericAudio } from './components/AudioEngine'
import { WAYPOINTS } from './config/sections'
import resumeUrl from './assets/Saurav_Kumar_Resume-1 (1).pdf'

import pridePortrait from './assets/portraits/pride.png'
import greedPortrait from './assets/portraits/greed.png'
import gluttonyPortrait from './assets/portraits/gluttony.png'
import lustPortrait from './assets/portraits/lust.png'
import envyPortrait from './assets/portraits/envy.png'
import wrathPortrait from './assets/portraits/wrath.png'
import slothPortrait from './assets/portraits/sloth.png'

const SCROLL_PAGES = 16

const PORTRAITS = {
  pride: pridePortrait,
  greed: greedPortrait,
  gluttony: gluttonyPortrait,
  lust: lustPortrait,
  envy: envyPortrait,
  wrath: wrathPortrait,
  sloth: slothPortrait,
}

const CAPABILITIES = [
  { number: '01', title: 'Product Thinking', copy: 'Transforming ambiguous, open-ended problem spaces into high-utility, resilient products.' },
  { number: '02', title: 'Full-Stack Engineering', copy: 'React, Next.js, Node.js, Python, FastAPI, relational & NoSQL databases, scalable REST & realtime APIs.' },
  { number: '03', title: 'Applied AI & Computer Vision', copy: 'MediaPipe real-time tracking, YOLOv8 + Deep SORT pipelines, NLP cosine intent matching, and production LLM orchestration.' },
  { number: '04', title: 'Creative WebGL & 3D Systems', copy: 'Immersive shaders, R3F interactive 3D viewports, and butter-smooth GSAP/Lenis micro-choreography.' },
]

const CERTIFICATIONS = [
  { issuer: 'Deloitte Australia × Forage', title: 'Data Analytics Job Simulation', date: '2026' },
  { issuer: 'JPMorgan Chase × Forage', title: 'Software Engineering Job Simulation', date: '2026' },
  { issuer: 'AWS × Forage', title: 'Solutions Architecture Job Simulation', date: '2026' },
  { issuer: 'Google Cloud', title: 'Engineer AI Agents with ADK', date: '2026' },
  { issuer: 'Google Cloud', title: 'Build Real World AI Apps with Gemini & Imagen', date: '2025' },
  { issuer: 'Google Cloud', title: 'Develop GenAI Apps with Gemini and Streamlit', date: '2026' },
]

function ArrowUpRight({ className = '' }) {
  return <span className={`arrow-icon ${className}`} aria-hidden="true">↗</span>
}

function ArrowDown({ className = '' }) {
  return <span className={`arrow-icon ${className}`} aria-hidden="true">↓</span>
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [fraction, setFraction] = useState(0)
  const scrollRef = useRef(0)
  const lenisRef = useRef(null)

  const { isPlaying: isPlayingSound, toggleSound } = useAtmosphericAudio()

  const projects = useMemo(() => WAYPOINTS.map((project) => ({
    ...project,
    image: PORTRAITS[project.portrait],
  })), [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    const updateScroll = (e) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentFraction = maxScroll > 0 ? e.scroll / maxScroll : 0
      setFraction(currentFraction)
      scrollRef.current = currentFraction
    }

    lenis.on('scroll', updateScroll)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  const jumpToFraction = useCallback((targetFraction) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetFraction * maxScroll, { duration: 1.6 })
    } else {
      window.scrollTo({
        top: targetFraction * maxScroll,
        behavior: 'smooth',
      })
    }
  }, [])

  // Calculate opacities for walking stages
  const heroOpacity = Math.max(0, 1 - fraction / 0.08)
  const isWalkingSins = fraction >= 0.06 && fraction <= 0.88
  // Finale is active strictly between 0.86 and 0.925, and completely drops to 0 before 0.935
  const finaleOpacity = Math.max(0, Math.min(1, (fraction - 0.86) / 0.035)) * Math.max(0, 1 - Math.max(0, fraction - 0.915) / 0.018)
  // Dossier starts smoothly after 0.938
  const dossierOpacity = Math.max(0, Math.min(1, (fraction - 0.938) / 0.025))

  return (
    <div className="portfolio-shell" style={{ '--page-progress': fraction }}>
      {/* 1. Loading Screen (CRT Broadcast -> Sandstorm Reveal) */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* 2. Magnetic Custom Cursor */}
      <MagneticCursor />

      {/* 3. Persistent Mousham-Style Editorial HUD */}
      <EditorialHUD
        fraction={fraction}
        isPlayingSound={isPlayingSound}
        onToggleSound={toggleSound}
        onJumpToFraction={jumpToFraction}
        resumeUrl={resumeUrl}
      />

      {/* 3B. Mobile Room View Switcher & Gesture Controller */}
      <MobileViewToggle fraction={fraction} />

      {/* 4. Full-Screen 3D React Three Fiber Wasteland Scene */}
      <div className="scene-canvas-container" aria-hidden="true">
        <Scene scrollRef={scrollRef} />
      </div>

      {/* Subtle overlays */}
      <div className="page-vignette" aria-hidden="true" />
      <div className="page-noise" aria-hidden="true" />

      {/* ── 5. SCROLL-DRIVEN DOM OVERLAYS ─────────────────── */}

      {/* ── STAGE 0: HERO SECTION ── */}
      <section
        className="hero-cinematic"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: heroOpacity * (loaded ? 1 : 0),
          transform: `translateY(${-fraction * 250}px)`,
          transition: 'opacity 0.6s ease-out',
          zIndex: 10,
          pointerEvents: heroOpacity > 0.05 ? 'auto' : 'none',
          padding: '0 24px',
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 'clamp(10px, 1.2vw, 12px)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#ff8a4c',
            marginBottom: 16,
            opacity: 0.85,
          }}
        >
          Full Stack Developer · Applied AI Engineer · Creative Dev
        </div>

        <h1
          style={{
            fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', serif",
            fontSize: 'clamp(46px, 10vw, 124px)',
            fontWeight: 700,
            color: '#f4f1ea',
            margin: 0,
            lineHeight: 0.92,
            letterSpacing: '0.02em',
            textShadow: '0 0 80px rgba(255,106,43,0.28), 0 0 30px rgba(0,0,0,0.8)',
          }}
        >
          SAURAV<br />
          <span style={{ color: '#ff7733' }}>KUMAR</span>
        </h1>

        <p
          style={{
            fontFamily: "'RuinedSerif', 'Liberation Serif', Georgia, serif",
            fontSize: 'clamp(15px, 1.8vw, 21px)',
            color: '#c8baaa',
            margin: '24px 0 0',
            maxWidth: 580,
            lineHeight: 1.6,
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          &ldquo;I built everything they asked for. They still said no.&rdquo;<br />
          <span style={{ fontStyle: 'normal', fontSize: '0.85em', color: '#8c8278', fontFamily: "'DM Sans', sans-serif" }}>
            A 3D walk through the 7 Deadly Sins of rejection — then rising above it all.
          </span>
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(20px, 5vw, 64px)',
            marginTop: 36,
          }}
        >
          {[
            { num: '13+', label: 'CERTIFICATIONS' },
            { num: '7', label: 'DEADLY SINS' },
            { num: '2027', label: 'B.TECH CSE' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'RuinedSerif', 'Space Grotesk', serif",
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 700,
                  color: '#ff8a4c',
                  lineHeight: 1,
                  letterSpacing: '0.04em',
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: '#8a7a6a',
                  letterSpacing: '0.15em',
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Call to Action */}
        <div
          style={{
            marginTop: 44,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            type="button"
            className="hud-resume-btn"
            data-cursor="DESCEND"
            onClick={() => jumpToFraction(0.12)}
            style={{ padding: '8px 20px', fontSize: 11 }}
          >
            BEGIN DESCENT <ArrowDown />
          </button>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.15em',
              color: '#74726d',
              marginTop: 6,
            }}
          >
            SCROLL TO WALK FORWARD
          </span>
        </div>
      </section>

      {/* ── STAGE 1–7: THE 7 DEADLY SINS WAYPOINTS ── */}
      {isWalkingSins &&
        WAYPOINTS.map((w) => (
          <WaypointText
            key={w.id}
            waypoint={w}
            scrollFraction={fraction}
            align="right"
          />
        ))}

      {/* ── STAGE 8: FINALE — TRANSCENDENCE ── */}
      <section
        className="finale-cinematic"
        style={{
          position: 'fixed',
          inset: 0,
          display: finaleOpacity > 0.01 ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '7vh',
          textAlign: 'center',
          opacity: finaleOpacity,
          zIndex: 10,
          pointerEvents: 'none',
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#ff8a4c',
            marginBottom: 8,
          }}
        >
          ∞ — TRANSCENDENCE
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#e8c9ad',
            background: 'rgba(26, 17, 12, 0.75)',
            border: '1px solid rgba(255, 138, 76, 0.35)',
            borderRadius: 20,
            padding: '4px 12px',
            marginBottom: 12,
            backdropFilter: 'blur(6px)',
          }}
        >
          <span style={{ color: '#ff8a4c' }}>↻</span> 360° SCULPTURE — DRAG TO ROTATE
        </div>
        <h2
          style={{
            fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', serif",
            fontSize: 'clamp(26px, 5vw, 56px)',
            fontWeight: 700,
            color: '#f4f1ea',
            margin: 0,
            maxWidth: 720,
            letterSpacing: '0.02em',
            lineHeight: 1.15,
            textShadow: '0 0 50px rgba(255,106,43,0.35)',
          }}
        >
          Still standing. Still building. Still powerful.
        </h2>
        <p
          style={{
            fontFamily: "'RuinedSerif', 'Liberation Serif', Georgia, serif",
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            color: '#d6c4b2',
            marginTop: 12,
            maxWidth: 620,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          &ldquo;I walked through all seven sins. I burned through every rejection. Levitating above the ashes with AI in my hands.&rdquo;
        </p>
        <button
          type="button"
          className="hud-resume-btn"
          data-cursor="DOSSIER"
          onClick={() => jumpToFraction(0.98)}
          style={{ marginTop: 18, pointerEvents: 'auto' }}
        >
          VIEW TECHNICAL ARCHIVE & DOSSIER <ArrowDown />
        </button>
      </section>

      {/* ── STAGE 9: SELECTED WORK DOSSIER & ARCHIVE ── */}
      <main
        className="dossier-archive"
        style={{
          position: 'relative',
          zIndex: 20,
          marginTop: `${(SCROLL_PAGES - 1.2) * 100}vh`,
          background: '#080807',
          borderTop: '1px solid rgba(255, 106, 43, 0.25)',
          boxShadow: '0 -40px 100px rgba(0,0,0,0.95)',
          opacity: dossierOpacity,
          pointerEvents: dossierOpacity > 0.1 ? 'auto' : 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* Selected Work Section */}
        <section id="work" className="work-section section-frame">
          <div className="section-label"><span>01 / 04</span><span>Selected work</span></div>
          <div className="work-section__header">
            <div>
              <p className="eyebrow">The Catalog</p>
              <h2>7 Stations.<br /><em>Every Proof of Work.</em></h2>
            </div>
            <p className="section-lede section-lede--small">
              Real products, real users, and production codebases built across applied AI, computer vision, full-stack development, and automation.
            </p>
          </div>

          <div className="project-list">
            {projects.map((project, index) => {
              const hasExternal = project.portfolioLink || project.liveLink || project.domain
              const primaryLink = project.liveLink || (project.domain ? `https://${project.domain}` : project.github)

              return (
                <article
                  className={`project-card ${index % 2 ? 'project-card--reverse' : ''}`}
                  key={project.id}
                >
                  <a
                    className="project-card__visual"
                    href={primaryLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title}`}
                    data-cursor={project.domain ? 'VISIT' : 'VIEW'}
                    style={{ '--project-image': `url(${project.image})` }}
                  >
                    <div className="project-card__visual-wash" />
                    <span className="project-card__number">0{index + 1}</span>
                    <span className="project-card__year">{project.year}</span>
                    <span className="project-card__visual-link">
                      {project.domain || 'View project'} <ArrowUpRight />
                    </span>
                  </a>

                  <div className="project-card__body">
                    <div className="project-card__eyebrow">
                      <span>SIN {project.numeral} — {project.sin}</span>
                      <span>Selected work / 0{index + 1}</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.body}</p>
                    <div className="project-card__tags">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <div className="project-card__links">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" data-cursor="CODE">
                          GitHub <ArrowUpRight />
                        </a>
                      )}
                      {project.domain && (
                        <a
                          href={`https://${project.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="VISIT"
                          style={{ color: '#ffaa66', fontWeight: 600 }}
                        >
                          {project.domain} <ArrowUpRight />
                        </a>
                      )}
                      {hasExternal && !project.domain && (
                        <a href={project.liveLink || project.portfolioLink} target="_blank" rel="noreferrer" data-cursor="LIVE">
                          Live build <ArrowUpRight />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="capabilities-section section-frame">
          <div className="section-label"><span>02 / 04</span><span>Core Capabilities</span></div>
          <div className="capabilities-section__intro">
            <p className="eyebrow">Engineering Arsenal</p>
            <h2>Speed, Ownership,<br /><em>and Applied AI Literacy.</em></h2>
          </div>
          <div className="capabilities-grid">
            {CAPABILITIES.map((capability) => (
              <article className="capability-card" key={capability.number}>
                <span className="capability-card__number">{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Certifications & Simulations */}
        <section className="capabilities-section section-frame" style={{ borderTop: '1px solid var(--line-soft)' }}>
          <div className="section-label"><span>03 / 04</span><span>Credentials & Proofs</span></div>
          <div className="capabilities-section__intro">
            <p className="eyebrow">Recognized Rigor</p>
            <h2>13+ Certifications &<br /><em>Enterprise Simulations.</em></h2>
          </div>
          <div className="capabilities-grid">
            {CERTIFICATIONS.map((cert, idx) => (
              <article className="capability-card" key={idx}>
                <span className="capability-card__number">0{idx + 1}</span>
                <h3>{cert.title}</h3>
                <p style={{ color: '#ff8a4c', fontSize: 11, fontFamily: "'DM Mono', monospace", margin: '6px 0 0' }}>
                  {cert.issuer} ({cert.date})
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Console */}
        <section id="contact" className="contact-section section-frame">
          <div className="contact-section__ghost" aria-hidden="true">Ω</div>
          <div className="section-label"><span>04 / 04</span><span>Direct Contact</span></div>
          <div className="contact-section__content">
            <p className="eyebrow">Ready for what&apos;s next?</p>
            <h2>Let&apos;s build<br /><em>something undeniable.</em></h2>
            <p className="section-lede">
              Seeking product-based and engineering roles where speed, ownership, and AI-native workflows are valued.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24 }}>
              <a className="button button--light" href="mailto:sauravggd@gmail.com" data-cursor="MAIL">
                sauravggd@gmail.com <ArrowUpRight />
              </a>
              <a className="button" href={resumeUrl} download data-cursor="CV" style={{ border: '1px solid var(--line)' }}>
                Download Resume <ArrowDown />
              </a>
            </div>
          </div>
          <div className="contact-section__aside">
            <span>Available for Full-Time Roles & Sprints</span>
            <span>Jaipur ↔ Bihar / Remote</span>
            <span>© 2026 Saurav Kumar</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <span>SAURAV KUMAR // 7DS WASTELAND</span>
          <div className="site-footer__links">
            <a href="https://github.com/SAURAV-GGD" target="_blank" rel="noreferrer" data-cursor="GITHUB">GitHub <ArrowUpRight /></a>
            <a href="https://www.linkedin.com/in/saurav-kumar-608b2b2a5" target="_blank" rel="noreferrer" data-cursor="LINKEDIN">LinkedIn <ArrowUpRight /></a>
            <a href="https://www.instagram.com/_sxurv_/" target="_blank" rel="noreferrer" data-cursor="INSTA">Instagram <ArrowUpRight /></a>
            <a href="https://lovehub.in" target="_blank" rel="noreferrer" data-cursor="LOVEHUB">LoveHub <ArrowUpRight /></a>
            <a href="https://saurav-ggd-portfolio.vercel.app/" target="_blank" rel="noreferrer" data-cursor="OLD">Burning Portfolio <ArrowUpRight /></a>
          </div>
          <button
            type="button"
            className="text-link"
            data-cursor="TOP"
            onClick={() => jumpToFraction(0)}
            style={{ background: 'transparent', border: 'none', color: '#ff8a4c', cursor: 'pointer' }}
          >
            Ascend to Top ↑
          </button>
        </footer>
      </main>

      {/* Scroll track height spacer */}
      <div className="scroll-spacer" aria-hidden="true" style={{ height: `${SCROLL_PAGES * 100}vh` }} />
    </div>
  )
}
