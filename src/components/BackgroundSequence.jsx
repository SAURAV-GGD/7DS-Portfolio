import { useEffect, useMemo, useRef, useState } from 'react'

const FRAME_MODULES = import.meta.glob('../../source-frames-zip1/ezgif-frame-*.jpg', {
  eager: true,
  import: 'default',
  query: '?url',
})

function getFrameUrls() {
  return Object.entries(FRAME_MODULES)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, undefined, { numeric: true }))
    .map(([, url]) => url)
}

function drawCover(ctx, canvas, image) {
  const width = window.innerWidth
  const height = window.innerHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#080807'
  ctx.fillRect(0, 0, width, height)

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const x = (width - drawWidth) / 2
  const y = (height - drawHeight) / 2

  ctx.drawImage(image, x, y, drawWidth, drawHeight)
}

export default function BackgroundSequence({ fraction = 0 }) {
  const canvasRef = useRef(null)
  const fractionRef = useRef(fraction)
  const dampedFractionRef = useRef(fraction)
  const frameRef = useRef(-1)
  const [images, setImages] = useState([])
  const [ready, setReady] = useState(false)
  const frameUrls = useMemo(() => getFrameUrls(), [])

  useEffect(() => {
    fractionRef.current = fraction
  }, [fraction])

  useEffect(() => {
    let disposed = false
    let loadedCount = 0
    const loadedImages = frameUrls.map((url) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        loadedCount += 1
        if (!disposed && loadedCount === frameUrls.length) {
          setImages(loadedImages)
          setReady(true)
        }
      }
      image.onerror = () => {
        loadedCount += 1
        if (!disposed && loadedCount === frameUrls.length) {
          setImages(loadedImages.filter((item) => item.complete && item.naturalWidth > 0))
          setReady(true)
        }
      }
      image.src = url
      return image
    })

    return () => {
      disposed = true
    }
  }, [frameUrls])

  useEffect(() => {
    if (!ready || !images.length || !canvasRef.current) return undefined

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationFrame = 0

    const render = () => {
      dampedFractionRef.current += (fractionRef.current - dampedFractionRef.current) * 0.075
      const nextFrame = Math.min(
        images.length - 1,
        Math.max(0, Math.round(dampedFractionRef.current * (images.length - 1))),
      )

      if (nextFrame !== frameRef.current) {
        const image = images[nextFrame]
        if (image?.naturalWidth) {
          frameRef.current = nextFrame
          drawCover(context, canvas, image)
        }
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const handleResize = () => {
      frameRef.current = -1
    }

    window.addEventListener('resize', handleResize)
    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [images, ready])

  return (
    <canvas
      ref={canvasRef}
      className="background-sequence"
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0 }}
    />
  )
}
