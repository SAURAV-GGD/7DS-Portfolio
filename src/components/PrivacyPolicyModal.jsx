import { useEffect } from 'react'

export default function PrivacyPolicyModal({ isOpen, onClose }) {
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
      aria-labelledby="privacy-policy-title"
      onClick={onClose}
    >
      <div
        className="policy-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="policy-modal-header">
          <div>
            <span className="policy-modal-tag">LEGAL ARCHIVE // 01</span>
            <h2 id="privacy-policy-title">Privacy Policy</h2>
            <p className="policy-modal-sub">7DS Portfolio · Saurav Kumar · Effective 2026</p>
          </div>
          <button
            type="button"
            className="policy-modal-close"
            onClick={onClose}
            aria-label="Close Privacy Policy"
          >
            ✕ ESC
          </button>
        </header>

        <div className="policy-modal-body">
          <section>
            <h3>1. Introduction & Overview</h3>
            <p>
              Welcome to the <strong>7DS Portfolio</strong> (available at{' '}
              <em>saurav-ggd-portfolio.vercel.app</em>). This interactive 3D WebGL portfolio was designed
              and built by <strong>Saurav Kumar</strong> to demonstrate full-stack engineering, applied AI,
              and creative WebGL development. We prioritize user privacy and uphold strict standards regarding
              data transparency.
            </p>
          </section>

          <section>
            <h3>2. Information We Do NOT Collect</h3>
            <p>
              We believe in minimal data overhead. When you browse this site:
            </p>
            <ul>
              <li>We <strong>do not</strong> collect your name, email, phone number, or physical address unless you voluntarily contact us via email.</li>
              <li>We <strong>do not</strong> sell, rent, or monetize any user data.</li>
              <li>We <strong>do not</strong> execute invasive biometric, fingerprinting, or tracking scripts.</li>
            </ul>
          </section>

          <section>
            <h3>3. Information Stored Locally on Your Device</h3>
            <p>
              To provide a seamless 60 FPS experience across desktop and mobile devices, we use your browser&apos;s
              client-side <code>localStorage</code> solely for functional preferences:
            </p>
            <ul>
              <li><strong>7ds_perf_quality:</strong> Remembers your chosen graphics mode (<em>High Fidelity</em> vs. <em>Smooth 60 FPS</em>).</li>
              <li><strong>7ds_audio_state:</strong> Remembers whether you toggled the atmospheric audio on or off.</li>
              <li><strong>7ds_cookie_consent:</strong> Remembers your cookie and local storage preferences.</li>
            </ul>
            <p>
              These values never leave your device and are not shared with any remote servers or advertising partners.
            </p>
          </section>

          <section>
            <h3>4. Hosting, Infrastructure & Third-Party Links</h3>
            <p>
              This website is hosted on <strong>Vercel</strong> and deployed via <strong>GitHub</strong>.
              These platforms may collect basic server-level access logs (such as IP addresses, browser user-agent,
              and request timestamps) for system security, DDoS mitigation, and reliability purposes.
            </p>
            <p>
              External links to GitHub, LinkedIn, Instagram, and live project deployments (e.g., LoveHub) are governed
              by their respective privacy policies.
            </p>
          </section>

          <section>
            <h3>5. Your Rights (GDPR & CCPA Compliance)</h3>
            <p>
              Regardless of your jurisdiction, you have the right to inspect, clear, or reset all local preferences at any time
              by clearing your browser&apos;s cookies and site data for this domain.
            </p>
          </section>

          <section>
            <h3>6. Contact & Inquiries</h3>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, feel free to reach out directly:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:sauravggd@gmail.com">sauravggd@gmail.com</a><br />
              <strong>Location:</strong> Jaipur ↔ Bihar, India
            </p>
          </section>
        </div>

        <footer className="policy-modal-footer">
          <span>7DS PORTFOLIO // STRICT PRIVACY STANDARDS</span>
          <button type="button" className="hud-resume-btn" onClick={onClose}>
            RETURN TO 3D EXPERIENCE
          </button>
        </footer>
      </div>
    </div>
  )
}
