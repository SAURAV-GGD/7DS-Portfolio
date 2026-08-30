const BAND = 0.05 // fraction-width over which text is fully visible

export default function WaypointText({ waypoint, scrollFraction, align }) {
  const dist = Math.abs(scrollFraction - waypoint.fraction)
  const opacity = Math.max(0, 1 - Math.max(0, dist - BAND) / 0.06)
  if (opacity <= 0.01) return null

  // Slide in from the side
  const slideOffset = Math.max(0, (dist - BAND) * 400)
  const direction = align === 'left' ? -1 : 1

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        [align]: '5%',
        transform: `translateY(-50%) translateX(${direction * slideOffset}px)`,
        maxWidth: 420,
        opacity,
        transition: 'opacity 0.15s linear',
        pointerEvents: opacity > 0.15 ? 'auto' : 'none',
        textAlign: align === 'left' ? 'left' : 'right',
        zIndex: 2,
      }}
    >
      {/* Backdrop blur for readability */}
      <div
        style={{
          position: 'absolute',
          inset: -20,
          background:
            align === 'left'
              ? 'linear-gradient(to right, rgba(10,6,4,0.7) 0%, transparent 100%)'
              : 'linear-gradient(to left, rgba(10,6,4,0.7) 0%, transparent 100%)',
          borderRadius: 12,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />

      {/* Sin numeral + name */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: '#ff4400',
          marginBottom: 6,
          opacity: 0.8,
        }}
      >
        SIN {waypoint.numeral}
      </div>

      {/* Sin label */}
      <div
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          color: '#ff8a4c',
          letterSpacing: 6,
          lineHeight: 1,
          marginBottom: 4,
          textShadow: '0 0 30px rgba(255,138,76,0.3)',
        }}
      >
        {waypoint.sin}
      </div>

      {/* Project title */}
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(18px, 2.5vw, 28px)',
          fontWeight: 400,
          color: '#f4e3d3',
          margin: 0,
          marginBottom: 10,
          lineHeight: 1.2,
          letterSpacing: 3,
        }}
      >
        {waypoint.title}
        {waypoint.year && (
          <span style={{ color: '#5a4a3a', fontSize: '0.7em', marginLeft: 8 }}>
            ({waypoint.year})
          </span>
        )}
      </h2>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(12px, 1.3vw, 14px)',
          color: '#a89a8a',
          lineHeight: 1.7,
          margin: '0 0 14px',
          fontWeight: 300,
        }}
      >
        {waypoint.body}
      </p>

      {/* Tech tags */}
      {waypoint.tags && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            marginBottom: 10,
          }}
        >
          {waypoint.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: '#ff8a4c',
                letterSpacing: 1,
                padding: '3px 8px',
                border: '1px solid rgba(255,138,76,0.2)',
                borderRadius: 3,
                background: 'rgba(255,138,76,0.05)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Project links */}
      {waypoint.github && (
        <div style={{ display: 'flex', gap: 10, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
          <a className="story-link" href={waypoint.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          {waypoint.portfolioLink && (
            <a className="story-link" href={waypoint.portfolioLink} target="_blank" rel="noreferrer">
              Old portfolio <span aria-hidden="true">↗</span>
            </a>
          )}
          {waypoint.liveLink && (
            <a className="story-link" href={waypoint.liveLink} target="_blank" rel="noreferrer">
              Live demo <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
