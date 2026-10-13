import { useEffect, useState } from 'react'
import { WAYPOINTS, FINALE_FRACTION, TOTAL_DEPTH } from '../config/sections'

export default function EditorialHUD({
  fraction,
  isPlayingSound,
  onToggleSound,
  onJumpToFraction,
  resumeUrl,
  isSmoothMode = false,
  onToggleQuality,
}) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Display IST time
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      setTimeStr(`${istString} IST`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate current sector name
  const currentDepth = (fraction * TOTAL_DEPTH).toFixed(1)
  let sectorLabel = '00 // DESCENT POINT'
  let activeSinIndex = -1

  if (fraction < 0.08) {
    sectorLabel = '00 // ENTRY CORRIDOR'
  } else if (fraction >= 0.92 && fraction < 0.99) {
    sectorLabel = 'Ω // TRANSCENDENCE'
    activeSinIndex = 7
  } else if (fraction >= 0.99) {
    sectorLabel = 'DOSSIER // ARCHIVE'
    activeSinIndex = 8
  } else {
    // Find closest waypoint
    for (let i = 0; i < WAYPOINTS.length; i++) {
      const w = WAYPOINTS[i]
      if (Math.abs(fraction - w.fraction) < 0.07) {
        sectorLabel = `SIN ${w.numeral} // ${w.sin}`
        activeSinIndex = i
        break
      }
    }
  }

  const percentage = Math.min(100, Math.max(0, fraction * 100)).toFixed(1)

  return (
    <aside className="editorial-hud" aria-label="HUD telemetry and controls">
      {/* ── TOP BAR ────────────────────────────────────── */}
      <header className="hud-top-bar">
        {/* Left: Identity & Monospace coordinates */}
        <div className="hud-identity">
          <a
            href="#top"
            className="hud-wordmark"
            data-cursor="TOP"
            onClick={(e) => {
              e.preventDefault()
              onJumpToFraction(0)
            }}
          >
            <span className="hud-name">SAURAV KUMAR</span>
            <span className="hud-badge">7DS</span>
          </a>
          <div className="hud-coords" aria-hidden="true">
            <span>26.9124° N, 75.7873° E</span>
            <span className="hud-dot" />
            <span>{timeStr || '18:30:00 IST'}</span>
          </div>
        </div>

        {/* Center: Live Sector & Depth Telemetry */}
        <div className="hud-telemetry" aria-live="polite">
          <div className="hud-telemetry-tag">TELEMETRY</div>
          <div className="hud-telemetry-status">
            <span className="hud-telemetry-pulse" />
            <span className="hud-telemetry-sector">{sectorLabel}</span>
            <span className="hud-telemetry-depth">[-Z {currentDepth}m]</span>
          </div>
        </div>

        {/* Right: Quality Toggle + Audio Engine Toggle + Status Pill */}
        <div className="hud-controls">
          {onToggleQuality && (
            <button
              type="button"
              className={`hud-quality-btn ${isSmoothMode ? 'is-smooth' : 'is-high'}`}
              onClick={onToggleQuality}
              data-cursor="MODE"
              title={`Graphics Quality: ${isSmoothMode ? 'Smooth (60 FPS)' : 'High Fidelity'}. Click to toggle.`}
              aria-label="Toggle 3D graphics quality"
            >
              <span className="quality-icon">{isSmoothMode ? '⚡' : '✦'}</span>
              <span className="quality-text">{isSmoothMode ? '60 FPS' : 'HIGH'}</span>
            </button>
          )}

          <button
            type="button"
            className={`hud-audio-btn ${isPlayingSound ? 'is-playing' : ''}`}
            onClick={onToggleSound}
            data-cursor={isPlayingSound ? 'MUTE' : 'UNMUTE'}
            aria-label={isPlayingSound ? 'Mute atmospheric audio' : 'Play atmospheric audio'}
          >
            <div className="hud-sound-bars" aria-hidden="true">
              <span className="sound-bar bar-1" />
              <span className="sound-bar bar-2" />
              <span className="sound-bar bar-3" />
            </div>
            <span className="hud-audio-label">
              {isPlayingSound ? 'AUDIO ON' : 'AUDIO OFF'}
            </span>
          </button>

          <div className="hud-status-pill">
            <span className="status-indicator-green" />
            <span className="status-text">AVAILABLE</span>
          </div>

          <a
            href={resumeUrl}
            download
            className="hud-resume-btn"
            data-cursor="RESUME"
          >
            CV ↗
          </a>
        </div>
      </header>

      {/* ── BOTTOM BAR / COMPASS ───────────────────────── */}
      <footer className="hud-bottom-bar">
        {/* Sin Navigation Compass */}
        <nav className="hud-compass" aria-label="Waypoints navigator">
          <span className="compass-title">SECTORS:</span>
          {WAYPOINTS.map((w, idx) => {
            const isActive = activeSinIndex === idx
            return (
              <button
                key={w.id}
                type="button"
                className={`hud-compass-item ${isActive ? 'is-active' : ''}`}
                data-cursor={w.sin}
                title={`${w.sin} (${w.title})`}
                onClick={() => onJumpToFraction(w.fraction)}
              >
                <span className="compass-numeral">{w.numeral}</span>
                <span className="compass-sin-name">{w.sin}</span>
              </button>
            )
          })}
          <button
            type="button"
            className={`hud-compass-item hud-compass-finale ${activeSinIndex === 7 ? 'is-active' : ''}`}
            data-cursor="FINALE"
            title="Transcendence Finale"
            onClick={() => onJumpToFraction(FINALE_FRACTION)}
          >
            <span className="compass-numeral">Ω</span>
            <span className="compass-sin-name">TRANSCEND</span>
          </button>
        </nav>

        {/* Scroll Meter */}
        <div className="hud-scroll-meter" aria-hidden="true">
          <span className="scroll-meter-label">PROGRESS</span>
          <span className="scroll-meter-val">[{percentage}%]</span>
          <div className="scroll-meter-bar">
            <span style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </footer>
    </aside>
  )
}
