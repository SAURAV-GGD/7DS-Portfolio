import { useState, useEffect } from 'react'

const CONSENT_KEY = '7ds_cookie_consent'

export default function CookieConsentBanner({ onOpenCookies }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY)
      if (!consent) {
        // Small delay so it doesn't distract during loading screen
        const timer = setTimeout(() => setVisible(true), 3500)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const handleAccept = (choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice)
    } catch {
      // Ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="cookie-consent-pill"
      role="region"
      aria-label="Cookie and storage preferences"
    >
      <div className="cookie-consent-content">
        <span className="cookie-consent-icon">⚡</span>
        <div className="cookie-consent-text">
          <strong>7DS PORTFOLIO // STORAGE NOTICE</strong>
          <p>
            We use minimal client-side storage to remember your 60 FPS performance mode and audio preferences.
            Zero tracking cookies.
          </p>
        </div>
      </div>
      <div className="cookie-consent-actions">
        <button
          type="button"
          className="cookie-btn-link"
          onClick={onOpenCookies}
        >
          Details
        </button>
        <button
          type="button"
          className="cookie-btn-secondary"
          onClick={() => handleAccept('essential')}
        >
          Essential Only
        </button>
        <button
          type="button"
          className="cookie-btn-primary"
          onClick={() => handleAccept('all')}
        >
          Accept All
        </button>
      </div>
    </div>
  )
}
