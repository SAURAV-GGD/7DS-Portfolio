import { Suspense, useState, useCallback, useEffect } from 'react'
import Scene from './components/Scene'
import WaypointText from './components/WaypointText'
import LoadingScreen from './components/LoadingScreen'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useScrollFraction } from './hooks/useScrollFraction'
import { WAYPOINTS } from './config/sections'
import resumeUrl from './assets/Saurav_Kumar_Resume-1 (1).pdf'

// Total virtual scroll length, in viewport heights.
// 14 pages for 7 waypoints + finale — tune to taste.
const SCROLL_PAGES = 14

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const scrollRef = useScrollProgress()
  const fraction = useScrollFraction()
  const heroOpacity = Math.max(0, 1 - fraction / 0.06)
  const finaleOpacity = Math.max(0, (fraction - 0.90) / 0.08)
  const contactOpacity = Math.max(0, (fraction - 0.96) / 0.04)

  const handleLoadingComplete = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    const { style } = document.body
    const previousOverflow = style.overflow
    style.overflow = loaded ? previousOverflow : 'hidden'
    return () => {
      style.overflow = previousOverflow
    }
  }, [loaded])

  return (
    <div>
      {/* Loading Screen — CRT broadcast → sandstorm */}
      {!loaded && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Fixed background canvas — never scrolls itself, camera moves instead */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <Scene scrollRef={scrollRef} />
        </Suspense>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: heroOpacity * (loaded ? 1 : 0),
          zIndex: 2,
          pointerEvents: 'none',
          transition: 'opacity 0.5s',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#c9a98d',
          }}
        >
          scroll to walk forward
        </span>
        <div
          style={{
            width: 1,
            height: 28,
            background: 'linear-gradient(to bottom, #ff6a2b, transparent)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Hero title */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          opacity: heroOpacity * (loaded ? 1 : 0),
          transition: 'opacity 0.8s ease-out',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        {/* Subtitle */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(9px, 1.2vw, 12px)',
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: '#ff8a4c',
            marginBottom: 16,
            opacity: 0.7,
          }}
        >
          Full Stack Developer · Applied AI Engineer
        </div>

        {/* Name */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(44px, 10vw, 120px)',
            color: '#f4e3d3',
            margin: 0,
            lineHeight: 0.9,
            letterSpacing: '8px',
            textShadow: '0 0 80px rgba(255,106,43,0.15)',
          }}
        >
          SAURAV
          <br />
          <span style={{ color: '#ff8a4c' }}>KUMAR</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(13px, 1.8vw, 18px)',
            color: '#8a7a6a',
            margin: '20px 0 0',
            maxWidth: 500,
            lineHeight: 1.6,
            fontWeight: 300,
            fontStyle: 'italic',
          }}
        >
          I built everything they asked for.
          <br />
          They still said no.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(20px, 4vw, 48px)',
            marginTop: 32,
          }}
        >
          {[
            { num: '13+', label: 'CERTIFICATIONS' },
            { num: '7', label: 'PROJECTS' },
            { num: '2027', label: 'GRADUATING' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(24px, 4vw, 40px)',
                  color: '#ff8a4c',
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: '#5a4a3a',
                  letterSpacing: 3,
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Deadly Sins waypoint text overlays */}
      {WAYPOINTS.map((w, i) => (
        <WaypointText
          key={w.id}
          waypoint={w}
          scrollFraction={fraction}
          align={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}

      {/* Finale text — TRANSCENDENCE */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '12%',
          textAlign: 'center',
          opacity: finaleOpacity,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#ff8a4c',
            marginBottom: 12,
          }}
        >
          ∞ — TRANSCENDENCE
        </div>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(20px, 4vw, 36px)',
            color: '#f4e3d3',
            margin: 0,
            maxWidth: 600,
            letterSpacing: 3,
            lineHeight: 1.2,
          }}
        >
          Still standing. Still building. Still powerful.
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: '#7a6a5a',
            marginTop: 14,
            fontStyle: 'italic',
          }}
        >
          I walked through all seven sins. And I&apos;m still here.
        </p>
      </div>

      {/* Contact section — fades in at very end */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(12px, 3vw, 32px)',
          padding: '16px 24px',
          opacity: contactOpacity,
          zIndex: 3,
          pointerEvents: contactOpacity > 0.1 ? 'auto' : 'none',
          background:
            'linear-gradient(to top, rgba(10,6,4,0.9) 0%, transparent 100%)',
        }}
      >
        {[
          {
            label: 'GitHub',
            href: 'https://github.com/SAURAV-GGD',
            icon: '↗',
          },
          {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/in/saurav-kumar-608b2b2a5',
            icon: '↗',
          },
          {
            label: 'Instagram',
            href: 'https://www.instagram.com/_sxurv_/',
            icon: '↗',
          },
          { label: 'Email', href: 'mailto:sauravggd@gmail.com', icon: '✉' },
          {
            label: 'Old Portfolio',
            href: 'https://saurav-ggd-portfolio.vercel.app/',
            icon: '↗',
          },
          { label: 'Resume', href: resumeUrl, icon: '↓', download: true },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            download={link.download || undefined}
            target={link.download || link.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(8px, 1vw, 11px)',
              color: '#8a7a6a',
              textDecoration: 'none',
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '6px 10px',
              border: '1px solid rgba(138,122,106,0.15)',
              borderRadius: 4,
              transition: 'all 0.3s ease',
            }}
            aria-label={link.label === 'Resume' ? 'Download Saurav Kumar resume' : `Open ${link.label}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ff8a4c'
              e.currentTarget.style.borderColor = 'rgba(255,138,76,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8a7a6a'
              e.currentTarget.style.borderColor = 'rgba(138,122,106,0.15)'
            }}
          >
            {link.label} {link.icon}
          </a>
        ))}
      </div>

      {/* Scroll spacer — its height is what actually creates the scroll */}
      <div style={{ height: `${SCROLL_PAGES * 100}vh` }} />

      {/* Global keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
