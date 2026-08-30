import { useEffect, useRef, useState } from 'react'
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

function PortraitArt({ src, materialRef }) {
  const texture = useTexture(src)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  return (
    <mesh>
      <planeGeometry args={[3.25, 4.35]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  )
}

// A portrait only starts loading while its station is approaching. That keeps
// the first load light without leaving an empty placeholder in the scene.
export default function SinPortrait({ waypoint, cameraZRef, side = 'right' }) {
  const groupRef = useRef()
  const artRef = useRef()
  const glowRef = useRef()
  const frameRef = useRef()
  const lightRef = useRef()
  const [isNearby, setIsNearby] = useState(false)

  const z = -waypoint.fraction * TOTAL_DEPTH
  const x = side === 'right' ? 3.45 : -3.45
  const src = PORTRAITS[waypoint.portrait]

  useFrame((state) => {
    const cameraZ = cameraZRef.current ?? 0
    const distance = Math.abs(cameraZ - z)
    const shouldRender = distance < 20
    const opacity = THREE.MathUtils.smoothstep(19 - distance, 0, 10) * 0.96

    if (shouldRender !== isNearby) setIsNearby(shouldRender)
    if (groupRef.current) {
      groupRef.current.position.y = 1.12 + Math.sin(state.clock.elapsedTime * 0.75 + z) * 0.08
    }

    if (artRef.current) artRef.current.opacity = opacity
    if (glowRef.current) glowRef.current.opacity = opacity * 0.38
    if (frameRef.current) frameRef.current.opacity = opacity * 0.82
    if (lightRef.current) lightRef.current.intensity = opacity * 4.5
  })

  return (
    <group ref={groupRef}>
      {isNearby && (
        <Billboard position={[x, 0, z]}>
          <mesh position={[0, 0, -0.04]}>
            <planeGeometry args={[4.15, 5.25]} />
            <meshBasicMaterial
              ref={glowRef}
              color="#ff4f19"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[3.55, 4.7]} />
            <meshBasicMaterial
              ref={frameRef}
              color="#0b0503"
              transparent
              opacity={0}
            />
          </mesh>
          <PortraitArt src={src} materialRef={artRef} />
        </Billboard>
      )}
      <pointLight ref={lightRef} position={[x, 0.35, z + 0.3]} color="#ff6a2b" intensity={0} distance={6} />
    </group>
  )
}
