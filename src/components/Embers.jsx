import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Enhanced Dual Particle System ──────────────────────────────
// Embers (orange/red, rising fast) + Ash (grey, floating slowly)
const DEPTH = 180
const SPREAD_X = 22
const SPREAD_Y = 12

// Color palette for embers
const EMBER_COLORS = [
  new THREE.Color('#ff9648'),
  new THREE.Color('#ff4500'),
  new THREE.Color('#ffcc33'),
  new THREE.Color('#ff6b35'),
  new THREE.Color('#ff8c00'),
]

const ASH_COLOR = new THREE.Color('#8a7a6a')

export default function Embers({ cameraZRef }) {
  const points = useRef()
  const isCompactViewport = typeof window !== 'undefined' && window.innerWidth < 768
  const emberCount = isCompactViewport ? 900 : 1800
  const ashCount = isCompactViewport ? 350 : 700
  const total = emberCount + ashCount

  const [{ positions, colors, sizes, seeds, types }] = useState(() => {
    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const sizes = new Float32Array(total)
    const seeds = new Float32Array(total)
    const types = new Uint8Array(total) // 0=ember, 1=ash

    for (let i = 0; i < total; i++) {
      const isAsh = i >= emberCount
      types[i] = isAsh ? 1 : 0

      positions[i * 3 + 0] = (Math.random() - 0.5) * SPREAD_X
      positions[i * 3 + 1] = Math.random() * SPREAD_Y - 1.5
      positions[i * 3 + 2] = -Math.random() * DEPTH
      seeds[i] = Math.random()

      if (isAsh) {
        // Ash — grey, larger
        colors[i * 3] = ASH_COLOR.r
        colors[i * 3 + 1] = ASH_COLOR.g
        colors[i * 3 + 2] = ASH_COLOR.b
        sizes[i] = 5 + Math.random() * 7
      } else {
        // Ember — warm colors, varied size
        const c = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)]
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
        sizes[i] = 4 + Math.random() * 10
      }
    }
    return { positions, colors, sizes, seeds, types }
  })

  useFrame((state, delta) => {
    if (!points.current) return
    const arr = points.current.geometry.attributes.position.array
    const camZ = cameraZRef.current ?? 0
    const t = state.clock.elapsedTime

    for (let i = 0; i < total; i++) {
      const idx = i * 3
      const seed = seeds[i]
      const isAsh = types[i] === 1

      if (isAsh) {
        // Ash — slow float, gentle drift, slight falling
        arr[idx + 1] += delta * (0.08 + seed * 0.12) * (seed > 0.5 ? 1 : -0.5)
        arr[idx + 0] += Math.sin(t * 0.3 + seed * 20) * delta * 0.08
      } else {
        // Ember — fast rise + horizontal wind drift
        arr[idx + 1] += delta * (0.3 + seed * 0.5)
        arr[idx + 0] += Math.sin(t * 0.6 + seed * 10) * delta * 0.18
      }

      // Recycle particles that drift too high
      if (arr[idx + 1] > SPREAD_Y * 0.6) {
        arr[idx + 1] = -1.5
      }
      if (arr[idx + 1] < -2) {
        arr[idx + 1] = SPREAD_Y * 0.4
      }

      // Recycle particles the camera has passed
      if (arr[idx + 2] > camZ + 3) {
        arr[idx + 2] = camZ - DEPTH * 0.8 - Math.random() * DEPTH * 0.2
        arr[idx + 0] = (Math.random() - 0.5) * SPREAD_X
        arr[idx + 1] = Math.random() * SPREAD_Y - 1.5
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={total}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={total}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-size" count={total} array={sizes} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (30.0 / max(1.0, -modelViewPosition.z));
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          void main() {
            float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
            float alpha = 1.0 - smoothstep(0.22, 0.5, distanceFromCenter);
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
      />
    </points>
  )
}
