import { useEffect, useRef, useState } from 'react'
import { useScrollFraction } from '../hooks/useScrollFraction'

const TOTAL_FRAMES = 100

export default function BackgroundSequence() {
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const fraction = useScrollFraction()
  const fractionRef = useRef(fraction)
  const currentDampedRef = useRef(fraction)
  const currentFrameRef = useRef(-1)
  const animFrameRef = useRef(null)

  // Keep ref in sync with scroll without triggering effect loops
  useEffect(() => {
    fractionRef.current = fraction
  }, [fraction])

  // Preload images
  useEffect(() => {
    const loadedImages = []
    let loadedCount = 0

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const frameNumber = i.toString().padStart(3, '0')
      img.src = `/frames/ezgif-frame-${frameNumber}.jpg`
      
      img.onload = () => {
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) {
          setImages(loadedImages)
        }
      }
      img.onerror = () => {
        console.warn(`Failed to load frame ${frameNumber}`)
        loadedCount++
        if (loadedCount === TOTAL_FRAMES) {
          setImages(loadedImages)
        }
      }
      loadedImages.push(img)
    }
  }, [])

  // Draw frame on canvas smoothly
  useEffect(() => {
    if (images.length !== TOTAL_FRAMES || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const renderLoop = () => {
      // Lerp (dampen) the fraction for effortless, continuous scrubbing
      currentDampedRef.current += (fractionRef.current - currentDampedRef.current) * 0.08

      // Calculate which frame to show
      let frameIndex = Math.floor(currentDampedRef.current * (TOTAL_FRAMES - 1))
      if (frameIndex < 0) frameIndex = 0
      if (frameIndex >= TOTAL_FRAMES) frameIndex = TOTAL_FRAMES - 1

      // Only redraw if frame changed
      if (currentFrameRef.current !== frameIndex) {
        currentFrameRef.current = frameIndex
        const img = images[frameIndex]
        
        if (img && img.complete && img.naturalWidth > 0) {
          // Ensure canvas internal resolution matches viewport
          if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
          }

          // Object-fit: cover logic
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
          const x = (canvas.width / 2) - (img.width / 2) * scale
          const y = (canvas.height / 2) - (img.height / 2) * scale

          // Use a black background fallback before drawing the image
          ctx.fillStyle = '#0a0604'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        }
      }
      
      animFrameRef.current = requestAnimationFrame(renderLoop)
    }

    animFrameRef.current = requestAnimationFrame(renderLoop)
    
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [images])

  // Handle window resize to redraw current frame
  useEffect(() => {
    const handleResize = () => {
      if (images.length === TOTAL_FRAMES && canvasRef.current) {
        const frameIndex = Math.max(0, currentFrameRef.current)
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = images[frameIndex]
        
        if (!img) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
        const x = (canvas.width / 2) - (img.width / 2) * scale
        const y = (canvas.height / 2) - (img.height / 2) * scale

        ctx.fillStyle = '#0a0604'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [images])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: images.length === TOTAL_FRAMES ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        background: '#0a0604' // Solid fallback color while loading
      }}
    />
  )
}
