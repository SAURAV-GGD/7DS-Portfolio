import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Fire Pillars — columns of fire along the walk path ─────────
// Each pillar = vertical particle cluster + flickering point light
const PILLAR_POSITIONS = [
  { x: -8, z: -20 },
  { x: 9, z: -40 },
  { x: -6, z: -65 },
  { x: 10, z: -85 },
  { x: -9, z: -105 },
  { x: 7, z: -125 },
  { x: -7, z: -150 },
  { x: 8, z: -170 },
]

const PARTICLES_PER_PILLAR = 40
const FIRE_COLORS = ['#ff6a2b', '#ff4500', '#ff8c00', '#ffaa33']

function FirePillar({ position }) {
  const groupRef = useRef()
  const pointsRef = useRef()
  const lightRef = useRef()

  const [{ positions, seeds }] = useState(() => {
    const count = PARTICLES_PER_PILLAR
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.5
      positions[i * 3 + 1] = Math.random() * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  })

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    const arr = pointsRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime

    for (let i = 0; i < PARTICLES_PER_PILLAR; i++) {
      const idx = i * 3
      const seed = seeds[i]

      // Rise fast + horizontal sway
      arr[idx + 1] += delta * (1.5 + seed * 2)
      arr[idx] += Math.sin(t * 2 + seed * 10) * delta * 0.3

      // Recycle at top
      if (arr[idx + 1] > 7) {
        arr[idx + 1] = 0
        arr[idx] = (Math.random() - 0.5) * 1.5
        arr[idx + 2] = (Math.random() - 0.5) * 1.5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Flicker the point light
    if (lightRef.current) {
      lightRef.current.intensity =
        15 + Math.sin(t * 8 + position[2] * 0.1) * 8 +
        Math.sin(t * 13 + position[0]) * 4
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <pointLight
        ref={lightRef}
        position={[0, 3, 0]}
        color={FIRE_COLORS[Math.abs(Math.round(position[2])) % FIRE_COLORS.length]}
        intensity={15}
        distance={15}
      />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLES_PER_PILLAR}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color={new THREE.Color('#ff6a2b')}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function FirePillars() {
  return (
    <group>
      {PILLAR_POSITIONS.map((p, i) => (
        <FirePillar key={i} position={[p.x, -1, p.z]} />
      ))}
    </group>
  )
}
