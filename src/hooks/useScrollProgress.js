import { useEffect, useRef } from 'react'

/**
 * Tracks page scroll and exposes a smoothed 0..1 progress value via a ref
 * (avoids re-render thrash — Scene reads scrollRef.current every frame).
 */
export function useScrollProgress() {
  const rawProgress = useRef(0)
  const smoothProgress = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      rawProgress.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    let raf
    const tick = () => {
      // lerp toward raw scroll for a slight cinematic lag on the camera
      smoothProgress.current +=
        (rawProgress.current - smoothProgress.current) * 0.07
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return smoothProgress
}
