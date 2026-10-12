import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { TOTAL_DEPTH } from '../config/sections'
import pride from '../assets/portraits/pride.png'
import greed from '../assets/portraits/greed.png'
import gluttony from '../assets/portraits/gluttony.png'
import lust from '../assets/portraits/lust.png'
import envy from '../assets/portraits/envy.png'
import wrath from '../assets/portraits/wrath.png'
import sloth from '../assets/portraits/sloth.png'

const PORTRAITS = { pride, greed, gluttony, lust, envy, wrath, sloth }
useTexture.preload(Object.values(PORTRAITS))

function PortraitArt({ src, materialRef }) {
  const texture = useTexture(src)
  const [clonedTexture] = useState(() => {
    const clone = texture.clone()
    clone.colorSpace = THREE.SRGBColorSpace
    return clone
  })

  return (
    <mesh position={[0, 0, 0.04]}>
      <planeGeometry args={[3.6, 4.8]} />
      <meshBasicMaterial
        ref={materialRef}
        map={clonedTexture}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  )
}

export default function SinPortrait({ waypoint, cameraZRef, side = 'right' }) {
  const groupRef = useRef()
  const artRef = useRef()
  const lightRef = useRef()
  const fillLightRef = useRef()
  const stoneRef = useRef()
  const [isNearby, setIsNearby] = useState(false)

  const z = -waypoint.fraction * TOTAL_DEPTH
  const x = side === 'right' ? 3.8 : -3.8
  const src = PORTRAITS[waypoint.portrait]

  useFrame((state) => {
    const cameraZ = cameraZRef.current ?? 0
    const distance = Math.abs(cameraZ - z)
    const shouldRender = distance < 28
    const opacity = THREE.MathUtils.smoothstep(24 - distance, 0, 10) * 0.98

    if (shouldRender !== isNearby) setIsNearby(shouldRender)

    const t = state.clock.elapsedTime
    if (groupRef.current) {
      // Subtle architectural grounding sway
      groupRef.current.position.y = 0.95 + Math.sin(t * 0.5 + z * 0.1) * 0.04
    }

    if (artRef.current) artRef.current.opacity = opacity
    if (stoneRef.current) {
      stoneRef.current.traverse((child) => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = opacity
        }
      })
    }

    // Dynamic torch flame flicker
    if (lightRef.current) {
      const flicker = Math.sin(t * 4.2 + z) * 0.4 + Math.sin(t * 8.7) * 0.2
      lightRef.current.intensity = opacity * (4.2 + flicker)
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = opacity * 1.5
    }
  })

  return (
    <group ref={groupRef}>
      {isNearby && (
        <group position={[x, 0, z]}>
          <Billboard>
            {/* ── Architectural 3D Roman Stele Altar ── */}
            <group ref={stoneRef}>
              {/* Massive Stone Pedestal Plinth Base */}
              <mesh position={[0, -2.62, -0.05]}>
                <boxGeometry args={[4.2, 0.7, 0.8]} />
                <meshStandardMaterial
                  color="#1c130d"
                  roughness={0.92}
                  metalness={0.08}
                  transparent
                  opacity={0}
                />
              </mesh>
              <mesh position={[0, -2.25, -0.03]}>
                <boxGeometry args={[3.9, 0.25, 0.6]} />
                <meshStandardMaterial
                  color="#2a1c13"
                  roughness={0.9}
                  metalness={0.1}
                  transparent
                  opacity={0}
                />
              </mesh>

              {/* Weathered Antique Bronze/Travertine Frame */}
              <mesh position={[0, 0, -0.04]}>
                <boxGeometry args={[3.92, 5.12, 0.2]} />
                <meshStandardMaterial
                  color="#160e0a"
                  roughness={0.88}
                  metalness={0.15}
                  transparent
                  opacity={0}
                />
              </mesh>

              {/* Classical Cornice Header */}
              <mesh position={[0, 2.65, -0.02]}>
                <boxGeometry args={[4.2, 0.35, 0.5]} />
                <meshStandardMaterial
                  color="#261912"
                  roughness={0.9}
                  metalness={0.1}
                  transparent
                  opacity={0}
                />
              </mesh>
            </group>

            {/* The High-Resolution Character Portrait */}
            <PortraitArt src={src} materialRef={artRef} />
          </Billboard>

          {/* Living Roman Torch Warm Key Light */}
          <pointLight
            ref={lightRef}
            position={[side === 'right' ? -1.6 : 1.6, 1.4, 1.8]}
            color="#ff8838"
            intensity={0}
            distance={9}
            decay={2}
          />

          {/* Soft Amber Rim / Ambient Bounce */}
          <pointLight
            ref={fillLightRef}
            position={[side === 'right' ? 2.0 : -2.0, 0.5, 0.5]}
            color="#ff5511"
            intensity={0}
            distance={7}
            decay={2}
          />
        </group>
      )}
    </group>
  )
}
