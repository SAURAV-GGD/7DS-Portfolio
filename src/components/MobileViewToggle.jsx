import { useState, useEffect } from 'react'
import { WAYPOINTS } from '../config/sections'

const STATION_RADIUS = 0.045

/**
 * MobileViewToggle: A Roman Brass & Obsidian quick-toggle bar
 * for mobile and responsive touch viewports.
 * Allows visitors to effortlessly switch focus between:
 * 1. [ 👤 PORTRAIT ] — Centers on Saurav's character portrait stele
 * 2. [ 🏛️ ROOM ] — Balanced wide temple view
 * 3. [ 📜 TABLET ] — Centers on the 3D chiseled stone inscription tablet
 */
export default function MobileViewToggle({ fraction }) {
  const activeSin = WAYPOINTS.find(
    (w) => Math.abs(fraction - w.fraction) < STATION_RADIUS
  )
  const isInside = Boolean(activeSin)

  const [activeMode, setActiveMode] = useState('room')
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  // Reset to default room view when entering a new chamber
  useEffect(() => {
    setActiveMode('room')
  }, [activeSin?.id])

  const handleSelectMode = (mode, targetValue) => {
    setActiveMode(mode)
    setShowSwipeHint(false)
    window.dispatchEvent(
      new CustomEvent('7ds-mobile-pan', { detail: { target: targetValue, mode } })
    )
  }

  if (!isInside) return null

  return (
    <aside
      className="mobile-view-toggle-container"
      aria-label="Room Camera View Controls"
    >
      {/* Quick Toggle Pill Bar */}
      <nav className="mobile-view-pill" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'portrait'}
          className={`mobile-view-btn ${activeMode === 'portrait' ? 'active' : ''}`}
          onClick={() => handleSelectMode('portrait', -1.0)}
          data-cursor="PORTRAIT"
        >
          <span className="btn-icon">👤</span> PORTRAIT
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'room'}
          className={`mobile-view-btn ${activeMode === 'room' ? 'active' : ''}`}
          onClick={() => handleSelectMode('room', 0.0)}
          data-cursor="SANCTUARY"
        >
          <span className="btn-icon">🏛️</span> ROOM
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeMode === 'tablet'}
          className={`mobile-view-btn ${activeMode === 'tablet' ? 'active' : ''}`}
          onClick={() => handleSelectMode('tablet', 0.85)}
          data-cursor="TABLET"
        >
          <span className="btn-icon">📜</span> TABLET
        </button>
      </nav>

      {/* Subtle Mobile Gesture Hint */}
      {showSwipeHint && (
        <div className="mobile-swipe-hint" aria-hidden="true">
          <span>‹</span> SWIPE LEFT / RIGHT TO LOOK <span>›</span>
        </div>
      )}
    </aside>
  )
}
