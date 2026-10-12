import { useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

// Helper for drawing realistic weathered travertine stone canvas background
function drawTravertineBase(ctx, width, height, seed = 0) {
  // Dark antique Roman stone base
  ctx.fillStyle = '#1a120c'
  ctx.fillRect(0, 0, width, height)

  // Weathered grain and mineral flecks
  for (let i = 0; i < 900; i++) {
    const rx = Math.abs((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1)
    const ry = Math.abs((Math.sin(i * 78.233 + seed) * 43758.5453) % 1)
    const rb = Math.abs((Math.sin(i * 45.164 + seed) * 43758.5453) % 1)
    const x = rx * width
    const y = ry * height
    const lum = Math.floor(rb * 24)
    ctx.fillStyle = `rgba(${34 + lum}, ${24 + lum * 0.7}, ${16 + lum * 0.5}, 0.22)`
    ctx.fillRect(x, y, 2 + rx * 5, 2 + ry * 4)
  }

  // Stone chiseled margin border
  ctx.strokeStyle = 'rgba(255, 145, 75, 0.32)'
  ctx.lineWidth = 3
  ctx.strokeRect(16, 16, width - 32, height - 32)
}

const FONT_SERIF = '"RuinedSerif", "Liberation Serif", "PT Serif", "Times New Roman", serif'

// Chiseled incised text helper with deep inner shadow and torch highlight
function drawChiseledText(ctx, text, x, y, options = {}) {
  const {
    font = `bold 36px ${FONT_SERIF}`,
    color = '#f5ede3',
    align = 'center',
    glowColor = 'rgba(255, 140, 70, 0.35)',
  } = options

  ctx.textAlign = align
  ctx.font = font

  // 1. Incised inner groove shadow (dark top-left chisel cut)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)'
  ctx.shadowBlur = 5
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 3
  ctx.fillStyle = '#0d0704'
  ctx.fillText(text, x, y)

  // 2. Front chiseled bevel face with warm torch illumination
  ctx.shadowColor = glowColor
  ctx.shadowBlur = 7
  ctx.shadowOffsetX = -1
  ctx.shadowOffsetY = -1
  ctx.fillStyle = color
  ctx.fillText(text, x, y)

  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

/**
 * 3D Overlapping Roman Brick Stone Tablet:
 * Constructed as authentic Opus Quadratum ashlar masonry — stacked, staggered
 * stone blocks/bricks with varying 3D depths that catch dancing torchlight.
 * Uses authoritative Liberation Serif / PT Serif typography with deep chiseled incisions.
 */
export default function EngravedStoneTablet({ waypoint, opacity = 1 }) {
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => setFontsReady(true))
    }
  }, [])

  // ── Generate Canvas Textures for each Brick Course ──────────────
  const textures = useMemo(() => {
    void fontsReady
    const texMap = {}

    // 1. Course 0: Top Capstone Header
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 1)
        drawChiseledText(
          ctx,
          `· SINVS ${waypoint.numeral} · ${waypoint.sin} ·`,
          canvas.width / 2,
          125,
          {
            font: `bold 44px ${FONT_SERIF}`,
            color: '#ff9455',
            glowColor: 'rgba(255, 145, 75, 0.45)',
          }
        )
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c0 = t
      }
    }

    // 2. Course 1: Project Title (Overlapping double brick course)
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 260
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 2)
        drawChiseledText(
          ctx,
          waypoint.title.toUpperCase(),
          canvas.width / 2,
          165,
          {
            font: `bold 74px ${FONT_SERIF}`,
            color: '#f8efe6',
            glowColor: 'rgba(255, 160, 90, 0.4)',
          }
        )
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c1 = t
      }
    }

    // 3. Course 2: Chronicle Year Course
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 140
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 3)
        drawChiseledText(
          ctx,
          `ANNO DOMINI ${waypoint.year || 'MMXXVI'}`,
          canvas.width / 2,
          90,
          {
            font: `italic 34px ${FONT_SERIF}`,
            color: '#bfaaa0',
          }
        )
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c2 = t
      }
    }

    // Split narrative body into two balanced courses
    const words = waypoint.body.split(' ')
    const mid = Math.ceil(words.length * 0.5)
    const bodyPart1 = words.slice(0, mid).join(' ')
    const bodyPart2 = words.slice(mid).join(' ')

    // 4. Course 3: Narrative Inscription Part 1
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 260
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 4)
        // Word wrap lines
        ctx.font = `italic 36px ${FONT_SERIF}`
        const pwords = bodyPart1.split(' ')
        let line = ''
        let y = 95
        for (let n = 0; n < pwords.length; n++) {
          const test = line + pwords[n] + ' '
          if (ctx.measureText(test).width > 1020 && n > 0) {
            drawChiseledText(ctx, line, canvas.width / 2, y, {
              font: `italic 36px ${FONT_SERIF}`,
              color: '#ded1c4',
            })
            line = pwords[n] + ' '
            y += 65
          } else {
            line = test
          }
        }
        drawChiseledText(ctx, line, canvas.width / 2, y, {
          font: `italic 36px ${FONT_SERIF}`,
          color: '#ded1c4',
        })
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c3 = t
      }
    }

    // 5. Course 4: Narrative Inscription Part 2
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 260
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 5)
        ctx.font = `italic 36px ${FONT_SERIF}`
        const pwords = bodyPart2.split(' ')
        let line = ''
        let y = 95
        for (let n = 0; n < pwords.length; n++) {
          const test = line + pwords[n] + ' '
          if (ctx.measureText(test).width > 1020 && n > 0) {
            drawChiseledText(ctx, line, canvas.width / 2, y, {
              font: `italic 36px ${FONT_SERIF}`,
              color: '#ded1c4',
            })
            line = pwords[n] + ' '
            y += 65
          } else {
            line = test
          }
        }
        drawChiseledText(ctx, line, canvas.width / 2, y, {
          font: `italic 36px ${FONT_SERIF}`,
          color: '#ded1c4',
        })
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c4 = t
      }
    }

    // 6. Course 5: Technology Seals
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 6)
        if (waypoint.tags) {
          drawChiseledText(
            ctx,
            `[  ${waypoint.tags.join('   ·   ')}  ]`,
            canvas.width / 2,
            115,
            {
              font: `bold 28px ${FONT_SERIF}`,
              color: '#ffaa66',
              glowColor: 'rgba(255, 150, 75, 0.4)',
            }
          )
        }
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c5 = t
      }
    }

    // 7. Course 6: Monument Foundation Plinth
    {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawTravertineBase(ctx, canvas.width, canvas.height, 7)
        drawChiseledText(
          ctx,
          '· 7DS ARCHIVUM ET MONUMENTUM ·',
          canvas.width / 2,
          115,
          {
            font: `bold 24px ${FONT_SERIF}`,
            color: 'rgba(255, 145, 75, 0.65)',
          }
        )
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        texMap.c6 = t
      }
    }

    return texMap
  }, [waypoint, fontsReady])

  // Brick body material (dark weathered travertine stone)
  const brickBodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#241710',
        roughness: 0.92,
        metalness: 0.08,
        transparent: true,
        opacity,
      }),
    [opacity]
  )

  // Sliced brick face helper: creates plane geometry mapped to UV slice of course texture
  const createBrickFaceGeometry = (w, h, uMin, uMax) => {
    const geo = new THREE.PlaneGeometry(w, h)
    const uv = geo.attributes.uv.array
    // Top-left, top-right, bottom-left, bottom-right
    uv[0] = uMin; uv[1] = 1.0
    uv[2] = uMax; uv[3] = 1.0
    uv[4] = uMin; uv[5] = 0.0
    uv[6] = uMax; uv[7] = 0.0
    geo.attributes.uv.needsUpdate = true
    return geo
  }

  // ── 3D Brick Courses Definition with Real Overlapping Depths ──────
  // TOTAL WIDTH = 3.8m, Courses stacked from Y = +2.2 down to Y = -2.15
  const courses = useMemo(() => {
    return [
      // Course 0: Capstone Header (1 wide block, protrudes at z = 0.12)
      {
        y: 2.20,
        h: 0.58,
        texKey: 'c0',
        bricks: [{ x: 0, w: 3.80, d: 0.26, z: 0.12, u0: 0.0, u1: 1.0 }],
      },
      // Course 1: Monumental Title (2 overlapping bricks: right steps forward to z = 0.14)
      {
        y: 1.45,
        h: 0.82,
        texKey: 'c1',
        bricks: [
          { x: -0.96, w: 1.86, d: 0.22, z: 0.08, u0: 0.0, u1: 0.5 },
          { x: 0.96, w: 1.86, d: 0.28, z: 0.14, u0: 0.5, u1: 1.0 },
        ],
      },
      // Course 2: Year Inscription (3 staggered bricks: center recessed at z = 0.06)
      {
        y: 0.82,
        h: 0.38,
        texKey: 'c2',
        bricks: [
          { x: -1.28, w: 1.22, d: 0.25, z: 0.10, u0: 0.0, u1: 0.33 },
          { x: 0.00, w: 1.22, d: 0.20, z: 0.06, u0: 0.33, u1: 0.67 },
          { x: 1.28, w: 1.22, d: 0.26, z: 0.11, u0: 0.67, u1: 1.0 },
        ],
      },
      // Course 3: Narrative Body Part 1 (2 overlapping bricks: left steps forward to z = 0.13)
      {
        y: 0.18,
        h: 0.82,
        texKey: 'c3',
        bricks: [
          { x: -0.96, w: 1.86, d: 0.27, z: 0.13, u0: 0.0, u1: 0.5 },
          { x: 0.96, w: 1.86, d: 0.22, z: 0.08, u0: 0.5, u1: 1.0 },
        ],
      },
      // Course 4: Narrative Body Part 2 (3 staggered bricks: center steps forward to z = 0.13)
      {
        y: -0.68,
        h: 0.82,
        texKey: 'c4',
        bricks: [
          { x: -1.28, w: 1.22, d: 0.22, z: 0.07, u0: 0.0, u1: 0.33 },
          { x: 0.00, w: 1.22, d: 0.28, z: 0.13, u0: 0.33, u1: 0.67 },
          { x: 1.28, w: 1.22, d: 0.24, z: 0.09, u0: 0.67, u1: 1.0 },
        ],
      },
      // Course 5: Technology Tags (2 overlapping bricks)
      {
        y: -1.45,
        h: 0.62,
        texKey: 'c5',
        bricks: [
          { x: -0.96, w: 1.86, d: 0.25, z: 0.10, u0: 0.0, u1: 0.5 },
          { x: 0.96, w: 1.86, d: 0.23, z: 0.07, u0: 0.5, u1: 1.0 },
        ],
      },
      // Course 6: Plinth Foundation Base (1 heavy ground base block, protrudes at z = 0.14)
      {
        y: -2.15,
        h: 0.68,
        texKey: 'c6',
        bricks: [{ x: 0, w: 3.90, d: 0.32, z: 0.14, u0: 0.0, u1: 1.0 }],
      },
    ]
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* ── 1. Heavy Roman Ashlar Backing Wall (Behind Mortar Seams) ── */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[4.2, 5.5, 0.20]} />
        <meshStandardMaterial
          color="#160e0a"
          roughness={0.96}
          metalness={0.04}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Classical Stele Top Header Cornice */}
      <mesh position={[0, 2.65, 0.02]}>
        <boxGeometry args={[4.2, 0.32, 0.36]} />
        <meshStandardMaterial
          color="#302016"
          roughness={0.9}
          metalness={0.08}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Classical Stele Base Pedestal */}
      <mesh position={[0, -2.65, 0.02]}>
        <boxGeometry args={[4.3, 0.35, 0.40]} />
        <meshStandardMaterial
          color="#302016"
          roughness={0.9}
          metalness={0.08}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ── 2. The 3D Overlapping Stone Bricks Courses ── */}
      {courses.map((course, cIdx) => {
        const tex = textures[course.texKey]
        if (!tex) return null

        return (
          <group key={`course-${cIdx}`} position={[0, course.y, 0]}>
            {course.bricks.map((brick, bIdx) => {
              const faceGeo = createBrickFaceGeometry(
                brick.w,
                course.h,
                brick.u0,
                brick.u1
              )

              return (
                <group
                  key={`brick-${cIdx}-${bIdx}`}
                  position={[brick.x, 0, brick.z]}
                >
                  {/* 3D Physical Stone Brick Block Body */}
                  <mesh material={brickBodyMaterial}>
                    <boxGeometry args={[brick.w, course.h, brick.d]} />
                  </mesh>

                  {/* Chiseled Inscribed Front Face Plate */}
                  <mesh position={[0, 0, brick.d / 2 + 0.005]} geometry={faceGeo}>
                    <meshStandardMaterial
                      map={tex}
                      roughness={0.78}
                      metalness={0.12}
                      transparent
                      opacity={opacity}
                    />
                  </mesh>
                </group>
              )
            })}
          </group>
        )
      })}
    </group>
  )
}
