import { useEffect, useRef, useState } from 'react'

export default function MagneticCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [cursorText, setCursorText] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Only run on non-touch devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY
      if (!isVisible) setIsVisible(true)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    let rafId
    const lerpRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }
      rafId = requestAnimationFrame(lerpRing)
    }
    rafId = requestAnimationFrame(lerpRing)

    // Interactive elements listener
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor], .story-link, .sin-compass-item')
      if (target) {
        setIsHovered(true)
        const customText = target.getAttribute('data-cursor') || ''
        setCursorText(customText)
      } else {
        setIsHovered(false)
        setCursorText('')
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [isVisible])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <div
      className="magnetic-cursor-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      aria-hidden="true"
    >
      {/* Precision Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: '50%',
          backgroundColor: '#ff6a2b',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
        }}
      />

      {/* Lagging Magnetic Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? 56 : 28,
          height: isHovered ? 56 : 28,
          marginLeft: isHovered ? -28 : -14,
          marginTop: isHovered ? -28 : -14,
          borderRadius: '50%',
          border: isHovered ? '1.5px solid rgba(255, 106, 43, 0.9)' : '1px solid rgba(255, 255, 255, 0.4)',
          backgroundColor: isHovered ? 'rgba(255, 106, 43, 0.12)' : 'transparent',
          backdropFilter: isHovered ? 'blur(2px)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), margin 0.25s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background-color 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        {cursorText && (
          <span
            style={{
              fontFamily: "'JetBrains Mono', 'DM Mono', monospace",
              fontSize: 8,
              letterSpacing: 1,
              color: '#fff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  )
}
