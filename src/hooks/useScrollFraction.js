import { useEffect, useState } from 'react'

export function useScrollFraction() {
  const [fraction, setFraction] = useState(0)

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setFraction(max > 0 ? window.scrollY / max : 0)
        raf = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return fraction
}
