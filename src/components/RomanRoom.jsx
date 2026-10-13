import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import RomanTorch from './RomanTorch'
import EngravedStoneTablet from './EngravedStoneTablet'

import pride from '../assets/portraits/pride.png'
import greed from '../assets/portraits/greed.png'
import gluttony from '../assets/portraits/gluttony.png'
import lust from '../assets/portraits/lust.png'
import envy from '../assets/portraits/envy.png'
import wrath from '../assets/portraits/wrath.png'
import sloth from '../assets/portraits/sloth.png'

const PORTRAITS = { pride, greed, gluttony, lust, envy, wrath, sloth }
useTexture.preload(Object.values(PORTRAITS))

// Weathered Roman masonry PBR tones
const STONE_WALL = '#281c15'
const STONE_FLOOR = '#1e140d'
const STONE_TRIM = '#38271c'
const BRONZE_GATE = '#18120c'

function PortraitStele({ src, opacity }) {
  const texture = useTexture(src)

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Travertine Stele Plinth */}
      <mesh position={[0, -2.5, 0]}>
        <boxGeometry args={[3.6, 0.7, 0.8]} />
        <meshStandardMaterial color="#1a110a" roughness={0.92} metalness={0.08} />
      </mesh>

      {/* Stele Backing Wall */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[3.4, 4.8, 0.22]} />
        <meshStandardMaterial color="#22160f" roughness={0.88} metalness={0.12} />
      </mesh>

      {/* Classical Stele Cornice Header */}
      <mesh position={[0, 2.52, -0.02]}>
        <boxGeometry args={[3.7, 0.35, 0.35]} />
        <meshStandardMaterial color={STONE_TRIM} roughness={0.88} metalness={0.15} />
      </mesh>

      {/* High-Resolution Portrait Art */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[3.2, 4.5]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/**
 * RomanRoom: Dedicated Side Temple Chamber off the main Roman Colonnade.
 * Sins alternate on the Left (index % 2 === 0) and Right (index % 2 === 1).
 * Features:
 * - Monumental entrance gate facing the colonnade with fluted columns & torches.
 * - Enclosed stone cella with paved floor, coffered ceiling, and side ashlar walls.
 * - Sanctuary Altar facing the doorway:
 *     - Monumental 3D Engraved Stone Tablet directly front-and-center.
 *     - Burning coal torches flanking BOTH sides of the stone tablet.
 *     - Character portrait stele alongside the altar with its own torch.
 */
export default function RomanRoom({ waypoint, index = 0, chamberZ, cameraZRef }) {
  const groupRef = useRef()
  const altarLightRef = useRef()
  const [isNearby, setIsNearby] = useState(false)

  const isLeft = index % 2 === 0
  const side = isLeft ? -1 : 1
  const facingYaw = isLeft ? Math.PI / 2 : -Math.PI / 2

  useFrame(() => {
    const camZ = cameraZRef.current ?? 0
    const distance = Math.abs(camZ - chamberZ)
    const active = distance < 28
    if (active !== isNearby) {
      setIsNearby(active)
    }

    if (active && altarLightRef.current) {
      const op = THREE.MathUtils.smoothstep(26 - distance, 0, 8) * 0.99
      altarLightRef.current.intensity = 2.8 * op
    }
  })

  const src = PORTRAITS[waypoint.portrait]

  return (
    <group ref={groupRef} position={[0, 0, chamberZ]}>
      {isNearby && (
        <>
          {/* ══════════════════════════════════════════════════════════
              1. ROOM ENCLOSURE: FLOOR, CEILING & WALLS
              ══════════════════════════════════════════════════════════ */}

          {/* Roman Paved Stone Floor */}
          <mesh position={[side * 8.5, -1.6, 0]}>
            <boxGeometry args={[9.6, 0.4, 13.2]} />
            <meshStandardMaterial
              color={STONE_FLOOR}
              roughness={0.88}
              metalness={0.08}
            />
          </mesh>

          {/* Coffered Roman Stone Ceiling Vault */}
          <mesh position={[side * 8.5, 7.3, 0]}>
            <boxGeometry args={[9.6, 0.5, 13.2]} />
            <meshStandardMaterial
              color={STONE_WALL}
              roughness={0.92}
              metalness={0.06}
            />
          </mesh>

          {/* Transverse Ceiling Beams (Coffers) */}
          {[-4.2, -1.4, 1.4, 4.2].map((bz) => (
            <mesh key={`beam-${bz}`} position={[side * 8.5, 6.9, bz]}>
              <boxGeometry args={[9.4, 0.45, 0.55]} />
              <meshStandardMaterial color={STONE_TRIM} roughness={0.9} metalness={0.08} />
            </mesh>
          ))}

          {/* Side Wall 1 (Back / Negative Z) */}
          <mesh position={[side * 8.5, 2.8, -6.6]}>
            <boxGeometry args={[9.6, 9.2, 0.7]} />
            <meshStandardMaterial color={STONE_WALL} roughness={0.92} metalness={0.06} />
          </mesh>

          {/* Side Wall 2 (Front / Positive Z) */}
          <mesh position={[side * 8.5, 2.8, 6.6]}>
            <boxGeometry args={[9.6, 9.2, 0.7]} />
            <meshStandardMaterial color={STONE_WALL} roughness={0.92} metalness={0.06} />
          </mesh>

          {/* Back Sanctuary Altar Wall (Opposite the gate entrance) */}
          <mesh position={[side * 13.3, 2.8, 0]}>
            <boxGeometry args={[0.8, 9.2, 13.2]} />
            <meshStandardMaterial color={STONE_WALL} roughness={0.92} metalness={0.06} />
          </mesh>

          {/* Pilasters along Back Sanctuary Wall */}
          {[-4.2, 0, 4.2].map((pz) => (
            <mesh key={`pilaster-back-${pz}`} position={[side * 12.8, 2.8, pz]}>
              <boxGeometry args={[0.3, 9.0, 0.9]} />
              <meshStandardMaterial color={STONE_TRIM} roughness={0.9} metalness={0.08} />
            </mesh>
          ))}

          {/* ══════════════════════════════════════════════════════════
              2. MONUMENTAL ENTRANCE GATE (Facing the Colonnade)
              ══════════════════════════════════════════════════════════ */}
          <group position={[side * 3.8, 0, 0]}>
            {/* Left Gate Wall Flank */}
            <mesh position={[0, 2.8, -4.6]}>
              <boxGeometry args={[0.7, 9.2, 4.0]} />
              <meshStandardMaterial color={STONE_WALL} roughness={0.92} metalness={0.06} />
            </mesh>

            {/* Right Gate Wall Flank */}
            <mesh position={[0, 2.8, 4.6]}>
              <boxGeometry args={[0.7, 9.2, 4.0]} />
              <meshStandardMaterial color={STONE_WALL} roughness={0.92} metalness={0.06} />
            </mesh>

            {/* Monumental Overhead Arch Lintel */}
            <mesh position={[0, 6.2, 0]}>
              <boxGeometry args={[1.2, 1.6, 6.2]} />
              <meshStandardMaterial color={STONE_TRIM} roughness={0.9} metalness={0.08} />
            </mesh>

            {/* Semicircular Entrance Arch Vault (Curves UPWARD overhead) */}
            <mesh position={[0, 4.6, 0]} rotation={[0, facingYaw, 0]}>
              <torusGeometry args={[2.5, 0.45, 12, 32, Math.PI]} />
              <meshStandardMaterial color={STONE_TRIM} roughness={0.92} metalness={0.06} />
            </mesh>

            {/* Flanking Entrance Columns */}
            <mesh position={[-side * 0.35, 1.8, -2.6]}>
              <cylinderGeometry args={[0.55, 0.65, 7.6, 24]} />
              <meshStandardMaterial color={STONE_TRIM} roughness={0.9} metalness={0.08} />
            </mesh>
            <mesh position={[-side * 0.35, 1.8, 2.6]}>
              <cylinderGeometry args={[0.55, 0.65, 7.6, 24]} />
              <meshStandardMaterial color={STONE_TRIM} roughness={0.9} metalness={0.08} />
            </mesh>

            {/* Wrought-Iron Open Gate Doors (Hinged inward) */}
            <mesh position={[side * 0.6, 1.4, -1.7]} rotation={[0, isLeft ? 0.8 : -0.8, 0]}>
              <boxGeometry args={[0.08, 4.8, 1.6]} />
              <meshStandardMaterial color={BRONZE_GATE} roughness={0.7} metalness={0.75} />
            </mesh>
            <mesh position={[side * 0.6, 1.4, 1.7]} rotation={[0, isLeft ? -0.8 : 0.8, 0]}>
              <boxGeometry args={[0.08, 4.8, 1.6]} />
              <meshStandardMaterial color={BRONZE_GATE} roughness={0.7} metalness={0.75} />
            </mesh>

            {/* Exterior Gate Torches (Facing Corridor) */}
            <RomanTorch
              position={[-side * 0.4, 2.4, -3.2]}
              rotation={[0, facingYaw, 0]}
              seed={index * 10 + 1}
              opacity={1}
            />
            <RomanTorch
              position={[-side * 0.4, 2.4, 3.2]}
              rotation={[0, facingYaw, 0]}
              seed={index * 10 + 2}
              opacity={1}
            />
          </group>

          {/* ══════════════════════════════════════════════════════════
              3. THE SANCTUARY ALTAR (Directly In Front of Camera!)
              ══════════════════════════════════════════════════════════ */}

          {/* 3A. MONUMENTAL 3D ENGRAVED STONE TABLET — Front and Center */}
          <group position={[side * 10.4, 1.4, 0]} rotation={[0, facingYaw, 0]}>
            <EngravedStoneTablet waypoint={waypoint} opacity={1} />
          </group>

          {/* 3B. BURNING COAL TORCHES FLANKING BOTH SIDES OF THE STONE TABLET */}
          {/* Left Flanking Torch */}
          <RomanTorch
            position={[side * 10.1, 1.8, -2.5]}
            rotation={[0, isLeft ? Math.PI / 2 + 0.35 : -Math.PI / 2 - 0.35, 0]}
            seed={index * 10 + 3}
            opacity={1}
          />

          {/* Right Flanking Torch */}
          <RomanTorch
            position={[side * 10.1, 1.8, 2.5]}
            rotation={[0, isLeft ? Math.PI / 2 - 0.35 : -Math.PI / 2 + 0.35, 0]}
            seed={index * 10 + 4}
            opacity={1}
          />

          {/* 3C. PORTRAIT STELE — Positioned beside the stone tablet */}
          <group
            position={[side * 10.1, 1.3, isLeft ? 4.3 : -4.3]}
            rotation={[0, isLeft ? Math.PI / 2 - 0.28 : -Math.PI / 2 + 0.28, 0]}
          >
            <PortraitStele src={src} opacity={1} />
          </group>

          {/* Portrait Flanking Torch */}
          <RomanTorch
            position={[side * 9.9, 2.0, isLeft ? 5.8 : -5.8]}
            rotation={[0, facingYaw, 0]}
            seed={index * 10 + 5}
            opacity={1}
          />

          {/* 3D. Warm Ambient Sanctuary Illumination */}
          <pointLight
            ref={altarLightRef}
            position={[side * 8.5, 3.8, 0]}
            color="#ff9a48"
            intensity={2.8}
            distance={14}
            decay={2}
          />
        </>
      )}
    </group>
  )
}
