import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import VolumetricFire from './VolumetricFire'

/**
 * 3D Roman Iron Sconce Torch with continuous burning fire,
 * ember sparks, and dynamic flickering illumination that casts
 * dancing amber light onto the carved stone inscriptions.
 */
export default function RomanTorch({ position = [0, 0, 0], rotation = [0, 0, 0], seed = 0, opacity = 1 }) {
  const groupRef = useRef()
  const lightRef = useRef()
  const sparksRef = useRef()

  const sparkCount = 14
  const sparkData = useMemo(() => {
    const positions = new Float32Array(sparkCount * 3)
    const speeds = new Float32Array(sparkCount)
    for (let i = 0; i < sparkCount; i++) {
      const rx = (Math.sin(i * 12.9898) * 43758.5453) % 1
      const ry = (Math.sin(i * 78.233) * 43758.5453) % 1
      const rz = (Math.sin(i * 45.164) * 43758.5453) % 1
      positions[i * 3 + 0] = (Math.abs(rx) - 0.5) * 0.18
      positions[i * 3 + 1] = Math.abs(ry) * 0.6
      positions[i * 3 + 2] = (Math.abs(rz) - 0.5) * 0.18
      speeds[i] = 0.8 + Math.abs((Math.sin(i * 91.34) * 43758.5453) % 1) * 1.2
    }
    return { positions, speeds }
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const timeWithSeed = t * 8.5 + seed * 13.7

    // Dynamic light flicker illuminating carved stone details
    if (lightRef.current) {
      const flicker = (Math.sin(timeWithSeed) * 0.7 + Math.sin(t * 19.3 + seed) * 0.35 + Math.sin(t * 31.7) * 0.15)
      lightRef.current.intensity = Math.max(0, (4.2 + flicker) * opacity)
    }

    // Rising spark particles
    if (sparksRef.current) {
      const pos = sparksRef.current.geometry.attributes.position.array
      for (let i = 0; i < sparkCount; i++) {
        const idx = i * 3
        pos[idx + 1] += delta * sparkData.speeds[i]
        pos[idx + 0] += Math.sin(t * 5 + i) * delta * 0.08
        if (pos[idx + 1] > 1.1) {
          pos[idx + 1] = 0.1
          pos[idx + 0] = (Math.random() - 0.5) * 0.16
          pos[idx + 2] = (Math.random() - 0.5) * 0.16
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ── 1. Wrought-Iron Wall Mount Bracket ── */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[0.26, 0.48, 0.08]} />
        <meshStandardMaterial color="#1a1410" roughness={0.7} metalness={0.7} />
      </mesh>

      {/* Forged Sconce Arm */}
      <mesh position={[0, -0.06, 0.18]} rotation={[0.42, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.44, 10]} />
        <meshStandardMaterial color="#221b14" roughness={0.65} metalness={0.75} />
      </mesh>

      {/* Brazier Torch Cup */}
      <mesh position={[0, 0.14, 0.35]}>
        <cylinderGeometry args={[0.2, 0.12, 0.32, 16]} />
        <meshStandardMaterial color="#2a1e16" roughness={0.75} metalness={0.6} />
      </mesh>

      {/* Glowing Coals Core — Incandescent Charred Briquettes */}
      <group position={[0, 0.28, 0.35]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.14, 0.1, 14]} />
          <meshStandardMaterial
            color="#140905"
            emissive="#ff3a00"
            emissiveIntensity={3.2}
            roughness={0.8}
          />
        </mesh>
        {/* Rough Coal Nuggets Cluster */}
        {[
          { pos: [-0.07, 0.05, -0.04], rot: [0.3, 0.5, 0.2], s: 0.065 },
          { pos: [0.06, 0.06, 0.03], rot: [0.8, 1.2, 0.4], s: 0.07 },
          { pos: [0.01, 0.07, -0.06], rot: [1.1, 0.3, 0.9], s: 0.055 },
          { pos: [-0.03, 0.06, 0.07], rot: [0.5, 1.8, 0.1], s: 0.06 },
        ].map((c, idx) => (
          <mesh key={idx} position={c.pos} rotation={c.rot} scale={c.s}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#0d0603"
              emissive={idx % 2 === 0 ? '#ff3e00' : '#ff6a00'}
              emissiveIntensity={2.8}
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* ── 2. Volumetric Raymarching Flame (mattatz/THREE.Fire) ── */}
      <group position={[0, 0.88, 0.35]}>
        <VolumetricFire
          size={[0.65, 1.25, 0.65]}
          color="#ff7a22"
          speed={1.5}
          seed={seed}
        />

        {/* Ember Sparks rising from coals */}
        <points ref={sparksRef} position={[0, -0.4, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={sparkCount}
              array={sparkData.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.032}
            color="#ffbb55"
            transparent
            opacity={0.85 * opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>

      {/* ── 3. Dynamic Amber Torchlight Illuminating Carved Stone ── */}
      <pointLight
        ref={lightRef}
        position={[0, 0.48, 0.38]}
        color="#ff8533"
        intensity={4.2 * opacity}
        distance={9.5}
        decay={2}
      />
    </group>
  )
}
