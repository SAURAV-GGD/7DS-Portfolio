import { useState, useEffect, useRef } from 'react'

// ─── CRT Emergency Broadcast → Sandstorm Reveal ────────────────
// Stage 1: CRT static + "THIS IS NOT A DRILL" (~2.5s)
// Stage 2: Dense sandstorm clears to reveal wasteland (~2.5s)
export default function LoadingScreen({ onComplete }) {
  const [stage, setStage] = useState(0) // 0=broadcast, 1=sandstorm, 2=done
  const [textIdx, setTextIdx] = useState(0)
  const [glitch, setGlitch] = useState(false)
  const [stormOpacity, setStormOpacity] = useState(1)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  const broadcastLines = [
    '⚠ EMERGENCY BROADCAST SYSTEM',
    '',
    'THIS IS NOT A DRILL',
    '',
    'SUBJECT: SAURAV_KUMAR',
    'STATUS: STILL OPERATIONAL',
    'PROJECTS RECOVERED: 7',
    'SINS CATALOGUED: 7',
    '',
    'SIGNAL LOST ▓▓▓▓▓▓▓▓',
  ]

  // Stage 0 — typewriter broadcast text
  useEffect(() => {
    if (stage !== 0) return
    if (textIdx >= broadcastLines.length) {
      // All lines typed — glitch then move to sandstorm
      setTimeout(() => setGlitch(true), 200)
      setTimeout(() => setStage(1), 800)
      return
    }
    const delay = textIdx === 0 ? 400 : textIdx === 2 ? 500 : 120
    const timer = setTimeout(() => setTextIdx((i) => i + 1), delay)
    return () => clearTimeout(timer)
  }, [stage, textIdx, broadcastLines.length])

  // Static noise canvas (CRT effect)
  useEffect(() => {
    if (stage > 1) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 200
    const h = 120
    canvas.width = w
    canvas.height = h

    const drawNoise = () => {
      const imageData = ctx.createImageData(w, h)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255
        imageData.data[i] = v
        imageData.data[i + 1] = v * 0.85
        imageData.data[i + 2] = v * 0.6
        imageData.data[i + 3] = 40 + Math.random() * 30
      }
      ctx.putImageData(imageData, 0, 0)
      rafRef.current = requestAnimationFrame(drawNoise)
    }
    drawNoise()
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage])

  // Stage 1 — sandstorm fade-out
  useEffect(() => {
    if (stage !== 1) return
    const start = performance.now()
    const duration = 2500

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setStormOpacity(1 - eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setStage(2)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage])

  // Stage 2 — complete
  useEffect(() => {
    if (stage === 2 && onComplete) {
      const timer = setTimeout(onComplete, 200)
      return () => clearTimeout(timer)
    }
  }, [stage, onComplete])

  const handleSkip = () => {
    setStage(2)
    if (onComplete) onComplete()
  }

  // Keyboard skip listener (Escape, Space, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Generate lightweight sandstorm particles (45 instead of 200 for 60fps)
  const [particles] = useState(() =>
    Array.from({ length: 45 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 5,
      speed: 0.5 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.5,
      delay: Math.random() * 1.5,
    }))
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#0a0604',
        transition: stage === 2 ? 'opacity 0.5s ease-out' : undefined,
        opacity: stage === 2 ? 0 : 1,
      }}
    >
      {/* CRT scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* Static noise canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: stage === 0 ? 0.15 : 0.08,
          pointerEvents: 'none',
          zIndex: 2,
          imageRendering: 'pixelated',
        }}
      />

      {/* CRT color distortion vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(10,6,4,0.8) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Stage 0: Broadcast text */}
      {stage === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 15%',
            zIndex: 4,
            filter: glitch
              ? 'hue-rotate(90deg) contrast(2) brightness(3)'
              : 'none',
            transition: 'filter 0.15s',
          }}
        >
          {broadcastLines.slice(0, textIdx).map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily:
                  i === 2
                    ? "'RuinedSerif', 'Liberation Serif', serif"
                    : "'JetBrains Mono', monospace",
                fontSize: i === 2 ? 'clamp(20px, 4vw, 36px)' : 'clamp(10px, 1.5vw, 14px)',
                color:
                  i === 0
                    ? '#ff4444'
                    : i === 2
                      ? '#ff8a4c'
                      : '#7a6a5a',
                letterSpacing: i === 2 ? '6px' : '3px',
                fontWeight: i === 2 ? 700 : 400,
                marginBottom: line === '' ? 12 : 6,
                textShadow:
                  i === 2
                    ? '0 0 20px rgba(255,138,76,0.6)'
                    : i === 0
                      ? '0 0 15px rgba(255,68,68,0.4)'
                      : 'none',
                animation:
                  i === textIdx - 1
                    ? 'fadeInLine 0.15s ease-out'
                    : undefined,
              }}
            >
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      )}

      {/* Stage 1: Sandstorm with name reveal */}
      {stage === 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            overflow: 'hidden',
          }}
        >
          {/* Name behind the storm */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              opacity: Math.max(0, 1 - stormOpacity * 1.5),
            }}
          >
            <div
              style={{
                fontFamily: "'RuinedSerif', 'Liberation Serif', 'PT Serif', serif",
                fontSize: 'clamp(44px, 11vw, 130px)',
                fontWeight: 700,
                color: '#f8efe6',
                letterSpacing: 'clamp(6px, 1.5vw, 16px)',
                lineHeight: 0.92,
                textTransform: 'uppercase',
                textShadow: '0 0 60px rgba(255,106,43,0.35), 0 20px 40px rgba(0,0,0,0.9)',
                textAlign: 'center',
              }}
            >
              SAURAV
              <br />
              KUMAR
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(9px, 1.2vw, 12px)',
                color: '#ff8a4c',
                letterSpacing: '6px',
                marginTop: 20,
                opacity: 0.7,
              }}
            >
              WALK THROUGH THE WASTELAND
            </div>
          </div>

          {/* Sand/dust particles */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              opacity: stormOpacity,
              background: `radial-gradient(ellipse at center, 
                rgba(74,38,23,${stormOpacity * 0.95}) 0%, 
                rgba(30,15,8,${stormOpacity * 0.98}) 100%)`,
            }}
          >
            {particles.map((p, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  background:
                    i % 3 === 0
                      ? '#ff9648'
                      : i % 3 === 1
                        ? '#c9a98d'
                        : '#8a6a50',
                  opacity: p.opacity * stormOpacity,
                  animation: `sandDrift ${2 + p.speed}s ${p.delay}s linear infinite`,
                  filter: i % 5 === 0 ? 'blur(1px)' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Skip button for immediate instant access */}
      {stage < 2 && (
        <button
          type="button"
          onClick={handleSkip}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 10,
            background: 'rgba(26, 17, 12, 0.75)',
            border: '1px solid rgba(255, 138, 76, 0.4)',
            color: '#ff9e58',
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            padding: '6px 16px',
            borderRadius: 20,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 138, 76, 0.2)'
            e.currentTarget.style.borderColor = '#ff8a4c'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(26, 17, 12, 0.75)'
            e.currentTarget.style.borderColor = 'rgba(255, 138, 76, 0.4)'
          }}
        >
          SKIP INTRO [ESC] ↵
        </button>
      )}

      {/* CSS animations */}
      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sandDrift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          25%  { transform: translate(15px, -8px) rotate(90deg); }
          50%  { transform: translate(-10px, 5px) rotate(180deg); }
          75%  { transform: translate(8px, -15px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
