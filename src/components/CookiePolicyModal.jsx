import { useEffect } from 'react'

export default function CookiePolicyModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="policy-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-policy-title"
      onClick={onClose}
    >
      <div
        className="policy-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="policy-modal-header">
          <div>
            <span className="policy-modal-tag">LEGAL ARCHIVE // 02</span>
            <h2 id="cookie-policy-title">Cookie & Local Storage Policy</h2>
            <p className="policy-modal-sub">7DS Portfolio · Saurav Kumar · Effective 2026</p>
          </div>
          <button
            type="button"
            className="policy-modal-close"
            onClick={onClose}
            aria-label="Close Cookie Policy"
          >
            ✕ ESC
          </button>
        </header>

        <div className="policy-modal-body">
          <section>
            <h3>1. What Are Cookies and Local Storage?</h3>
            <p>
              Cookies and Web Local Storage (<code>localStorage</code>) are standard browser features that allow
              websites to store small pieces of textual information on your local device. This allows the application
              to remember stateful user interactions across page reloads and scroll sessions.
            </p>
          </section>

          <section>
            <h3>2. How the 7DS Portfolio Uses Local Storage</h3>
            <p>
              We exclusively use <strong>strictly functional, non-tracking client storage</strong> to deliver
              an optimal 3D experience tailored to your device:
            </p>
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Storage Key</th>
                  <th>Purpose</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>7ds_perf_quality</code></td>
                  <td>Stores your preference between High Quality (cinematic post-processing) and Smooth Mode (60 FPS low-overhead).</td>
                  <td>Persistent until cleared</td>
                </tr>
                <tr>
                  <td><code>7ds_audio_state</code></td>
                  <td>Remembers whether the ambient sound synthesizer is enabled or muted.</td>
                  <td>Persistent until cleared</td>
                </tr>
                <tr>
                  <td><code>7ds_cookie_consent</code></td>
                  <td>Records your acknowledgment of this Cookie & Privacy notice.</td>
                  <td>Persistent until cleared</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h3>3. Third-Party Tracking & Advertising</h3>
            <p>
              The <strong>7DS Portfolio does NOT deploy third-party advertising cookies</strong>, behavioral retargeting pixels,
              or cross-site surveillance technologies. We do not partner with ad networks or data brokers.
            </p>
          </section>

          <section>
            <h3>4. How to Manage or Delete Local Data</h3>
            <p>
              You have full control over your stored preferences. You can delete all data stored by this site at any time through:
            </p>
            <ul>
              <li><strong>Chrome / Brave / Edge:</strong> Settings → Privacy & Security → Clear Browsing Data → Cookies & Site Data.</li>
              <li><strong>Safari:</strong> Settings → Safari → Clear History and Website Data.</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data → Clear Data.</li>
            </ul>
          </section>

          <section>
            <h3>5. Contact</h3>
            <p>
              Questions regarding cookie usage? Email: <a href="mailto:sauravggd@gmail.com">sauravggd@gmail.com</a>
            </p>
          </section>
        </div>

        <footer className="policy-modal-footer">
          <span>7DS PORTFOLIO // ZERO TRACKING COOKIES</span>
          <button type="button" className="hud-resume-btn" onClick={onClose}>
            RETURN TO 3D EXPERIENCE
          </button>
        </footer>
      </div>
    </div>
  )
}
