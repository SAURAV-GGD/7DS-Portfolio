import { useEffect, useMemo, useState } from 'react'
import BackgroundSequence from './components/BackgroundSequence'
import { WAYPOINTS } from './config/sections'
import resumeUrl from './assets/Saurav_Kumar_Resume-1 (1).pdf'
import pridePortrait from './assets/portraits/pride.png'
import greedPortrait from './assets/portraits/greed.png'
import gluttonyPortrait from './assets/portraits/gluttony.png'
import lustPortrait from './assets/portraits/lust.png'
import envyPortrait from './assets/portraits/envy.png'
import wrathPortrait from './assets/portraits/wrath.png'
import slothPortrait from './assets/portraits/sloth.png'

const SCROLL_PAGES = 9

const PORTRAITS = {
  pride: pridePortrait,
  greed: greedPortrait,
  gluttony: gluttonyPortrait,
  lust: lustPortrait,
  envy: envyPortrait,
  wrath: wrathPortrait,
  sloth: slothPortrait,
}

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Selected work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

const CAPABILITIES = [
  { number: '01', title: 'Product thinking', copy: 'Turning open-ended problems into clear, useful experiences.' },
  { number: '02', title: 'Full-stack craft', copy: 'React, Node.js, Python, APIs, databases, and the details between them.' },
  { number: '03', title: 'Applied AI', copy: 'Practical ML and automation that improve the way people work.' },
  { number: '04', title: 'Visual systems', copy: 'Interfaces with a point of view, built to feel as good as they function.' },
]

function ArrowUpRight({ className = '' }) {
  return <span className={`arrow-icon ${className}`} aria-hidden="true">↗</span>
}

function ArrowDown({ className = '' }) {
  return <span className={`arrow-icon ${className}`} aria-hidden="true">↓</span>
}

function usePageScrollFraction() {
  const [fraction, setFraction] = useState(0)

  useEffect(() => {
    let rafId = 0

    const update = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        setFraction(maxScroll > 0 ? window.scrollY / maxScroll : 0)
        rafId = 0
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return fraction
}

function ProjectCard({ project, index }) {
  const hasExternal = project.portfolioLink || project.liveLink

  return (
    <article className={`project-card ${index % 2 ? 'project-card--reverse' : ''}`}>
      <a
        className="project-card__visual"
        href={project.github}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.title} on GitHub`}
        style={{ '--project-image': `url(${project.image})` }}
      >
        <div className="project-card__visual-wash" />
        <span className="project-card__number">0{index + 1}</span>
        <span className="project-card__year">{project.year}</span>
        <span className="project-card__visual-link">View project <ArrowUpRight /></span>
      </a>

      <div className="project-card__body">
        <div className="project-card__eyebrow">
          <span>{project.sin}</span>
          <span>Selected work / 0{index + 1}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.body}</p>
        <div className="project-card__tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="project-card__links">
          <a href={project.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          {hasExternal && (
            <a href={project.liveLink || project.portfolioLink} target="_blank" rel="noreferrer">
              Live build <ArrowUpRight />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const fraction = usePageScrollFraction()
  const [menuOpen, setMenuOpen] = useState(false)

  const projects = useMemo(() => WAYPOINTS.map((project) => ({
    ...project,
    image: PORTRAITS[project.portrait],
  })), [])

  const activeProject = Math.min(
    projects.length - 1,
    Math.max(0, Math.floor(Math.max(0, fraction - 0.13) / 0.105)),
  )

  const heroProgress = Math.min(1, fraction / 0.16)
  const navScrolled = fraction > 0.025

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="portfolio-shell" style={{ '--page-progress': fraction }}>
      <BackgroundSequence fraction={fraction} />
      <div className="page-vignette" aria-hidden="true" />
      <div className="page-noise" aria-hidden="true" />

      <header className={`site-header ${navScrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
        <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Saurav Kumar home">
          <span className="wordmark__mark">SK</span>
          <span className="wordmark__divider">/</span>
          <span className="wordmark__label">Portfolio</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
        </nav>

        <a className="header-cta" href="#contact" onClick={closeMenu}>
          <span>Let&apos;s talk</span>
          <ArrowUpRight />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="menu-toggle__line" aria-hidden="true" />
        </button>

        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
          ))}
          <a href="#contact" onClick={closeMenu}>Let&apos;s talk <ArrowUpRight /></a>
        </nav>
      </header>

      <main>
        <section
          id="top"
          className="hero-section"
          style={{ '--hero-progress': heroProgress }}
        >
          <div className="hero-section__grid" aria-hidden="true" />
          <div className="hero-section__shade" aria-hidden="true" />

          <div className="hero-meta hero-meta--top">
            <span className="section-index">01 / 07</span>
            <p>Full-stack developer<br />Applied AI engineer</p>
          </div>

          <div className="hero-meta hero-meta--side">
            <span>Scroll to explore</span>
            <span className="hero-meta__line" aria-hidden="true" />
            <span>2026</span>
          </div>

          <div className="hero-content">
            <p className="eyebrow">Portfolio / built with intent</p>
            <h1>Built for<br /><em>what&apos;s next.</em></h1>
            <p className="hero-summary">
              I&apos;m Saurav Kumar — a developer working across product, AI, and the space where a good idea becomes real.
            </p>
            <div className="hero-actions">
              <a className="button button--light" href="#work">Explore work <ArrowDown /></a>
              <a className="text-link" href={resumeUrl} download>Download resume <ArrowUpRight /></a>
            </div>
          </div>

          <div className="hero-bottomline">
            <span>01 — 07</span>
            <span>Selected projects / 2024—26</span>
            <span className="hero-bottomline__scroll">Keep moving <ArrowDown /></span>
          </div>
        </section>

        <section id="about" className="manifesto-section section-frame">
          <div className="section-label"><span>02 / 07</span><span>Point of view</span></div>
          <div className="manifesto-section__copy">
            <p className="eyebrow">The brief</p>
            <h2>Every project starts with a <em>better question.</em></h2>
            <p className="section-lede">
              Good software is not a pile of features. It is a clear response to a real human need — shaped with enough curiosity to find the signal and enough discipline to make it last.
            </p>
            <a className="text-link" href="#work">See selected work <ArrowUpRight /></a>
          </div>
          <div className="manifesto-section__quote">
            <span className="quote-mark">“</span>
            <p>I build products that make complex systems feel obvious.</p>
            <span className="quote-credit">Saurav Kumar / 2026</span>
          </div>
        </section>

        <section id="work" className="work-section section-frame">
          <div className="section-label"><span>03 / 07</span><span>Selected work</span></div>
          <div className="work-section__header">
            <div>
              <p className="eyebrow">A field guide</p>
              <h2>Work with<br /><em>some weight.</em></h2>
            </div>
            <p className="section-lede section-lede--small">
              Seven projects across full-stack development, applied AI, automation, and the edges in between.
            </p>
          </div>

          <div className="work-section__progress" aria-hidden="true">
            <span>Selected work</span>
            <span>0{activeProject + 1} / 07</span>
            <div className="work-section__progress-bar"><span style={{ width: `${((activeProject + 1) / projects.length) * 100}%` }} /></div>
          </div>

          <div className="project-list">
            {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          </div>
        </section>

        <section className="capabilities-section section-frame">
          <div className="section-label"><span>06 / 07</span><span>How I work</span></div>
          <div className="capabilities-section__intro">
            <p className="eyebrow">The toolkit</p>
            <h2>Curiosity,<br /><em>with a delivery date.</em></h2>
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

        <section id="contact" className="contact-section section-frame">
          <div className="contact-section__ghost" aria-hidden="true">07</div>
          <div className="section-label"><span>07 / 07</span><span>Open line</span></div>
          <div className="contact-section__content">
            <p className="eyebrow">Have a hard problem?</p>
            <h2>Let&apos;s build<br /><em>through it.</em></h2>
            <p className="section-lede">For collaborations, ambitious ideas, or a conversation about what&apos;s next.</p>
            <a className="button button--light" href="mailto:sauravggd@gmail.com">Start a conversation <ArrowUpRight /></a>
          </div>
          <div className="contact-section__aside">
            <span>Available for select work</span>
            <span>New Delhi / Remote</span>
            <span>© 2026 Saurav Kumar</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>SK / 2026</span>
        <div className="site-footer__links">
          <a href="https://github.com/SAURAV-GGD" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a>
          <a href="https://www.linkedin.com/in/saurav-kumar-608b2b2a5" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a>
          <a href={resumeUrl} download>Resume <ArrowUpRight /></a>
        </div>
        <a href="#top">Back to top <ArrowUpRight /></a>
      </footer>

      <div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${fraction})` }} /></div>
      <div className="scroll-spacer" aria-hidden="true" style={{ height: `${SCROLL_PAGES * 100}vh` }} />
    </div>
  )
}
