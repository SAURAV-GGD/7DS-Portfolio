import { useState } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import bgImg from '../assets/wasteland/layer-bg.jpg'
import emberImg from '../assets/wasteland/layer-embers.jpg'
import ruins01 from '../assets/wasteland/layer-ruins-01.jpg'
import ruins02 from '../assets/wasteland/layer-ruins-02.jpg'
import ruins03 from '../assets/wasteland/layer-ruins-03.jpg'
import ruins04 from '../assets/wasteland/layer-ruins-04.jpg'
import ruins05 from '../assets/wasteland/layer-ruins-05.jpg'
import ruins06 from '../assets/wasteland/layer-ruins-06.jpg'

const PATH_DEPTH = 180

// Texture pool — cycled through for varied backdrops
const TEXTURES_LIST = [bgImg, ruins01, ruins03, emberImg, ruins02, ruins05, ruins04, ruins06]

export default function Wasteland() {
  const baseTextures = useTexture(TEXTURES_LIST)
  const [textures] = useState(() =>
    baseTextures.map(t => {
      const clone = t.clone()
      clone.colorSpace = THREE.SRGBColorSpace
      return clone
    })
  )

  // Main backdrop layers — deep parallax planes with varied textures
  const backdropCount = 14
  const backdrops = Array.from({ length: backdropCount }, (_, i) => {
    const z = -i * (PATH_DEPTH / backdropCount)
    const tex = textures[i % textures.length]
    const scale = 1 + (i % 3) * 0.15 // slight scale variation
    const xOffset = (i % 2 === 0 ? 1 : -1) * (i % 4) * 1.5 // parallax offset
    return (
      <mesh key={`bg-${i}`} position={[xOffset, 6 * scale, z]}>
        <planeGeometry args={[46 * scale, 22 * scale]} />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.5 - i * 0.015}
          fog
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  })

  // Ruin corridor walls — dark vertical planes on left and right
  // Creates the claustrophobic ruins-corridor feel
  const wallCount = 20
  const walls = Array.from({ length: wallCount }, (_, i) => {
    const z = -i * (PATH_DEPTH / wallCount) - 5
    const side = i % 2 === 0 ? -1 : 1
    const xBase = 12 + (i % 3) * 3
    const height = 8 + (i % 4) * 4
    const width = 3 + (i % 3) * 2
    return (
      <mesh
        key={`wall-${i}`}
        position={[side * xBase, height / 2 - 1.6, z]}
        rotation={[0, side * 0.15, 0]}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#1a0d06"
          transparent
          opacity={0.6}
          roughness={1}
          fog
          side={THREE.DoubleSide}
        />
      </mesh>
    )
  })

  // Fire-glow point lights along the path
  const fireLights = [
    { pos: [-8, 2, -15], color: '#ff6a2b', intensity: 30, distance: 25 },
    { pos: [10, 3, -35], color: '#ff4500', intensity: 25, distance: 20 },
    { pos: [-6, 1.5, -60], color: '#ffaa33', intensity: 35, distance: 25 },
    { pos: [9, 2.5, -85], color: '#ff6a2b', intensity: 28, distance: 22 },
    { pos: [-7, 2, -110], color: '#ff4500', intensity: 32, distance: 25 },
    { pos: [8, 3, -135], color: '#ffaa33', intensity: 25, distance: 20 },
    { pos: [-5, 2, -160], color: '#ff6a2b', intensity: 30, distance: 25 },
    { pos: [6, 1.5, -180], color: '#ff4500', intensity: 35, distance: 30 },
  ]

  return (
    <group>

      {backdrops}
      {walls}

      {/* ground — long dark plane the "walk" happens along */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.6, -PATH_DEPTH / 2]}
      >
        <planeGeometry args={[60, PATH_DEPTH + 60]} />
        <meshStandardMaterial
          color="#1a0a04"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Cracked ground detail plane — slightly above main ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.55, -PATH_DEPTH / 2]}
      >
        <planeGeometry args={[40, PATH_DEPTH + 40]} />
        <meshStandardMaterial
          color="#241108"
          roughness={0.95}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Fire-glow point lights */}
      {fireLights.map((fl, i) => (
        <pointLight
          key={`fire-${i}`}
          position={fl.pos}
          color={fl.color}
          intensity={fl.intensity}
          distance={fl.distance}
        />
      ))}

      {/* Main warm rim light */}
      <pointLight
        position={[0, 4, -10]}
        color="#ff6a2b"
        intensity={45}
        distance={35}
      />

      {/* Ambient — slightly warmer and brighter */}
      <ambientLight color="#3a2013" intensity={0.7} />

      {/* Directional light for overall scene illumination */}
      <directionalLight
        position={[5, 10, -20]}
        color="#4a2617"
        intensity={0.4}
      />
    </group>
  )
}
