import { useState } from 'react'

// Strict isolation: only the active waypoint is visible, never adjacent ones.
const BAND = 0.022 // tight plateau where card is 100% visible
const FADE = 0.024 // smooth fade-in/fade-out falloff (total radius 0.046 < 0.06 half-waypoint spacing)

export default function WaypointText({ waypoint, scrollFraction, align }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const dist = Math.abs(scrollFraction - waypoint.fraction)
  if (dist > BAND + FADE) return null

  // Smooth Hermite interpolation for butter-smooth fade
  const rawProgress = Math.max(0, 1 - Math.max(0, dist - BAND) / FADE)
  const opacity = rawProgress * rawProgress * (3 - 2 * rawProgress)
  if (opacity <= 0.01) return null

  // Subtle editorial slide offset
  const slideOffset = (1 - rawProgress) * (align === 'left' ? -36 : 36)

  return (
    <div
      className="waypoint-inscription-card"
      style={{
        transform: `translateX(${slideOffset}px)`,
        opacity,
        pointerEvents: opacity > 0.4 ? 'auto' : 'none',
      }}
    >
      {/* Classical Inscribed Inner Border */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 8,
          border: '1px solid rgba(255, 138, 76, 0.14)',
          pointerEvents: 'none',
        }}
      />

      {/* Classical Corner Accents */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: corner.includes('top') ? 6 : 'auto',
            bottom: corner.includes('bottom') ? 6 : 'auto',
            left: corner.includes('left') ? 6 : 'auto',
            right: corner.includes('right') ? 6 : 'auto',
            width: 8,
            height: 8,
            borderTop: corner.includes('top') ? '2px solid #ff9a55' : 'none',
            borderBottom: corner.includes('bottom') ? '2px solid #ff9a55' : 'none',
            borderLeft: corner.includes('left') ? '2px solid #ff9a55' : 'none',
            borderRight: corner.includes('right') ? '2px solid #ff9a55' : 'none',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Ghost Roman Numeral Watermark in background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: align === 'left' ? 20 : 'auto',
          left: align === 'right' ? 20 : 'auto',
          bottom: -15,
          fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
          fontSize: 155,
          fontWeight: 900,
          color: 'rgba(255, 122, 54, 0.04)',
          lineHeight: 0.8,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {waypoint.numeral}
      </div>

      {/* Header Tagline — Latin Inscription Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          borderBottom: '1px solid rgba(255, 138, 76, 0.16)',
          paddingBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', 'Cinzel', serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#ff9a55',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textShadow: '1px 1px 0 rgba(255,180,120,0.25), -1px -1px 2px rgba(0,0,0,0.9)',
          }}
        >
          <span style={{ color: '#ff7733', fontSize: 13 }}>✦</span>
          · SINVS {waypoint.numeral} · {waypoint.sin} ·
        </span>
        {waypoint.year && (
          <span
            style={{
              fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', serif",
              fontSize: 10,
              fontWeight: 600,
              color: '#a89482',
              letterSpacing: '0.14em',
            }}
          >
            A.D. {waypoint.year}
          </span>
        )}
      </div>

      {/* Project title — Deep Chiseled Monumental Capitals */}
      <h2
        style={{
          fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', 'Cinzel', serif",
          fontSize: 'clamp(26px, 3.2vw, 38px)',
          fontWeight: 700,
          color: '#f8efe6',
          margin: '0 0 14px',
          lineHeight: 1.12,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textShadow:
            '1px 1px 0 rgba(255, 180, 120, 0.32), -2px -2px 3px rgba(0, 0, 0, 0.95), 0 0 20px rgba(255, 120, 40, 0.22)',
        }}
      >
        {waypoint.title}
      </h2>

      {/* Mobile Story Toggle Button */}
      <button
        type="button"
        className="waypoint-expand-btn mobile-only"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {isExpanded ? '▲ HIDE INSCRIPTION' : '▼ READ FULL INSCRIPTION'}
      </button>

      {/* Narrative confession / Carved Story Inscription */}
      <div className={`waypoint-story-block ${isExpanded ? 'is-expanded' : ''}`}>
        <p
          style={{
            fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', Georgia, serif",
            fontSize: 'clamp(14px, 1.3vw, 16px)',
            color: '#d6c4b2',
            lineHeight: 1.6,
            margin: '0 0 16px',
            fontWeight: 400,
            fontStyle: 'italic',
            textShadow: '1px 1px 1px rgba(0,0,0,0.85)',
          }}
        >
          &ldquo;{waypoint.body}&rdquo;
        </p>
      </div>

      {/* Tech tags — Bronze Chiseled Plaques */}
      {waypoint.tags && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 26,
          }}
        >
          {waypoint.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 9.5,
                fontWeight: 600,
                color: '#ffb585',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                border: '1px solid rgba(255, 138, 76, 0.28)',
                borderRadius: 2,
                background: 'rgba(30, 20, 15, 0.85)',
                boxShadow: 'inset 0 1px 0 rgba(255, 180, 120, 0.1)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Action Links — Classical Roman Seals */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {waypoint.domain && (
          <a
            className="hud-resume-btn"
            href={waypoint.liveLink || `https://${waypoint.domain}`}
            target="_blank"
            rel="noreferrer"
            data-cursor="VISIT"
            style={{
              padding: '9px 20px',
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: '0.14em',
              background: '#ff7733',
              color: '#080807',
              borderColor: '#ff7733',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            VISIT {waypoint.domain} <span aria-hidden="true">↗</span>
          </a>
        )}
        {waypoint.liveLink && !waypoint.domain && (
          <a
            className="hud-resume-btn"
            href={waypoint.liveLink}
            target="_blank"
            rel="noreferrer"
            data-cursor="LIVE"
            style={{
              padding: '9px 20px',
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: '0.14em',
              background: '#ff7733',
              color: '#080807',
              borderColor: '#ff7733',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            LIVE SYSTEM <span aria-hidden="true">↗</span>
          </a>
        )}
        {waypoint.portfolioLink && !waypoint.domain && (
          <a
            className="hud-resume-btn"
            href={waypoint.portfolioLink}
            target="_blank"
            rel="noreferrer"
            data-cursor="PREVIEW"
            style={{
              padding: '9px 18px',
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: '0.14em',
              background: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255, 138, 76, 0.35)',
              color: '#f4e8db',
            }}
          >
            PORTFOLIO BUILD <span aria-hidden="true">↗</span>
          </a>
        )}
        {waypoint.github && (
          <a
            className="hud-resume-btn"
            href={waypoint.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="CODE"
            style={{
              padding: '9px 18px',
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: '0.14em',
              background: 'transparent',
              borderColor: 'rgba(255, 138, 76, 0.35)',
              color: '#ffb585',
            }}
          >
            SOURCE ARCHIVE <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </div>
  )
}

