import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TOTAL_DEPTH, FINALE_FRACTION } from '../config/sections'
import finalePortrait from '../assets/portraits/finale.png'

const ENERGY_PARTICLE_COUNT = 90

// The final chapter is a real illustration backed by physical glow, orbiting
// energy emblems, and rising particles rather than the former capsule stand-in.
export default function FinaleFigure({ cameraZRef }) {
  const groupRef = useRef()
  const glowLeftRef = useRef()
  const glowRightRef = useRef()
  const energyRef = useRef()

  const texture = useTexture(finalePortrait)
  const [portraitTexture] = useState(() => {
    const clone = texture.clone()
    clone.colorSpace = THREE.SRGBColorSpace
    return clone
  })

  const z = -FINALE_FRACTION * TOTAL_DEPTH

  const [energyPositions] = useState(() => {
    const positions = new Float32Array(ENERGY_PARTICLE_COUNT * 3)
    for (let i = 0; i < ENERGY_PARTICLE_COUNT; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 4.5
      positions[i * 3 + 1] = Math.random() * 4 - 1.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5
    }
    return positions
  })

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    const distance = Math.abs((cameraZRef.current ?? 0) - z)
    const opacity = THREE.MathUtils.smoothstep(26 - distance, 0, 12)

    groupRef.current.position.y = 0.9 + Math.sin(time * 0.72) * 0.11
    groupRef.current.rotation.y = Math.sin(time * 0.28) * 0.035
    groupRef.current.traverse((object) => {
      if (object.material?.opacity !== undefined) object.material.opacity = opacity
    })

    if (glowLeftRef.current) glowLeftRef.current.intensity = opacity * (6 + Math.sin(time * 3.1) * 1.8)
    if (glowRightRef.current) glowRightRef.current.intensity = opacity * (6 + Math.sin(time * 3.1 + 1.4) * 1.8)

    if (energyRef.current) {
      const positions = energyRef.current.geometry.attributes.position.array
      for (let i = 0; i < ENERGY_PARTICLE_COUNT; i += 1) {
        const index = i * 3
        positions[index + 1] += delta * 0.7
        if (positions[index + 1] > 3.3) {
          positions[index] = (Math.random() - 0.5) * 4.5
          positions[index + 1] = -1.5
          positions[index + 2] = (Math.random() - 0.5) * 2.5
        }
      }
      energyRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.9, z]}>
      <Billboard position={[0, 1.6, 0]}>
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[6.2, 8]} />
          <meshBasicMaterial
            color="#f2551e"
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <planeGeometry args={[5.4, 7.2]} />
          <meshBasicMaterial
            map={portraitTexture}
            transparent
            opacity={1}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      {/* Claude-inspired orange energy emblem — left hand. */}
      <pointLight ref={glowLeftRef} position={[-2.15, 2.1, 0.35]} color="#ff7a30" distance={6} />
      <mesh position={[-2.15, 2.1, 0.22]} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 8, 32]} />
        <meshBasicMaterial color="#ff9a55" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh position={[-2.15, 2.1, 0.24]}>
        <icosahedronGeometry args={[0.12, 1]} />
        <meshBasicMaterial color="#ffd0a5" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* Antigravity-inspired blue-white energy emblem — right hand. */}
      <pointLight ref={glowRightRef} position={[2.15, 2.1, 0.35]} color="#5ba3ff" distance={6} />
      <mesh position={[2.15, 2.1, 0.22]} rotation={[-Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 8, 32]} />
        <meshBasicMaterial color="#79b8ff" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh position={[2.15, 2.1, 0.24]}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshBasicMaterial color="#e3f1ff" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.92, 0]}>
        <circleGeometry args={[3, 48]} />
        <meshBasicMaterial color="#ff6a2b" transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      <points ref={energyRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={ENERGY_PARTICLE_COUNT} array={energyPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#ffb066"
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
