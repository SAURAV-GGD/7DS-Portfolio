import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TOTAL_DEPTH, FINALE_FRACTION } from '../config/sections'

// ─── Procedural PBR Stone & Marble Materials ─────────────────────
const STONE_COLOR = '#38281d'
const ACCENT_STONE = '#4d3728'
const RUST_COLOR = '#66391d'

function ColumnSegment({ position, height = 9, radius = 0.55, isBroken = false }) {
  return (
    <group position={position}>
      {/* Plinth Base */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[radius * 2.8, 0.8, radius * 2.8]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.92} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[radius * 1.3, radius * 1.45, 0.4, 24]} />
        <meshStandardMaterial color={ACCENT_STONE} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Fluted Column Shaft */}
      <mesh position={[0, (height / 2) + 1.1, 0]}>
        <cylinderGeometry args={[radius * 0.92, radius, height, 28]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.88} metalness={0.04} />
      </mesh>

      {/* Capital Header (if not broken) */}
      {!isBroken ? (
        <group position={[0, height + 1.3, 0]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[radius * 1.5, radius * 0.95, 0.6, 24]} />
            <meshStandardMaterial color={ACCENT_STONE} roughness={0.9} metalness={0.06} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[radius * 3.1, 0.35, radius * 3.1]} />
            <meshStandardMaterial color={STONE_COLOR} roughness={0.92} metalness={0.05} />
          </mesh>
        </group>
      ) : (
        /* Jagged broken stone top */
        <mesh position={[0, height + 1.1, 0]}>
          <coneGeometry args={[radius * 0.9, 0.8, 7]} />
          <meshStandardMaterial color={RUST_COLOR} roughness={0.95} metalness={0.02} />
        </mesh>
      )}
    </group>
  )
}

function MonumentalArchway({ position, width = 16, height = 12 }) {
  return (
    <group position={position}>
      {/* Left Pillar */}
      <ColumnSegment position={[-width / 2, -1.6, 0]} height={height} radius={0.75} />
      {/* Right Pillar */}
      <ColumnSegment position={[width / 2, -1.6, 0]} height={height} radius={0.75} />

      {/* Massive Cross Entablature / Lintel Beam */}
      <mesh position={[0, height + 0.3, 0]}>
        <boxGeometry args={[width + 3.5, 1.4, 2.8]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Upper Pediment Attic */}
      <mesh position={[0, height + 1.4, 0]}>
        <boxGeometry args={[width + 1.5, 0.9, 2.2]} />
        <meshStandardMaterial color={ACCENT_STONE} roughness={0.92} metalness={0.04} />
      </mesh>

      {/* Curved Archway Barrel Vault Overhead */}
      <mesh position={[0, height - 2.5, 0]}>
        <torusGeometry args={[width / 2.2, 0.65, 12, 32, Math.PI]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.92} metalness={0.05} />
      </mesh>
    </group>
  )
}

function FallenColumnDrum({ position, rotation = [0, 0, Math.PI / 2] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.58, 3.2, 20]} />
        <meshStandardMaterial color={ACCENT_STONE} roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  )
}

export default function RomanRuins() {
  const waterRef = useRef()

  // Generate colonnade arrays along the walk path
  const colonnades = useMemo(() => {
    const list = []
    const spacing = 12
    const totalCount = Math.floor(TOTAL_DEPTH / spacing)

    for (let i = 0; i < totalCount; i++) {
      const z = -i * spacing - 6
      const isLeftBroken = i % 3 === 1
      const isRightBroken = i % 4 === 2
      const leftH = 8 + (i % 3) * 2
      const rightH = 8 + ((i + 1) % 3) * 2

      list.push({
        id: `col-${i}`,
        z,
        isLeftBroken,
        isRightBroken,
        leftH,
        rightH,
      })
    }
    return list
  }, [])

  // Monumental arches at grand transitions
  const archPositions = [
    { z: -14, w: 15, h: 11 },   // Gateway Arch
    { z: -55, w: 16, h: 12 },   // Basilicas Arch
    { z: -98, w: 17, h: 13 },   // Aqueduct Forum
    { z: -140, w: 16, h: 12 },  // Imperial Ruin Arch
  ]

  // Rotunda Ring Pillars around the Transcendence Finale
  const finaleZ = -FINALE_FRACTION * TOTAL_DEPTH
  const pantheonPillars = useMemo(() => {
    const radius = 9.5
    const count = 12
    const pillars = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const px = Math.cos(angle) * radius
      const pz = finaleZ + Math.sin(angle) * radius
      pillars.push({ x: px, z: pz, angle })
    }
    return pillars
  }, [finaleZ])

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle organic water ripple motion
      waterRef.current.position.y = -1.58 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015
    }
  })

  return (
    <group>
      {/* ── Submerged Dark Water Surface ─────────────────── */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.58, -TOTAL_DEPTH / 2]}
      >
        <planeGeometry args={[70, TOTAL_DEPTH + 80]} />
        <meshStandardMaterial
          color="#060403"
          roughness={0.65}
          metalness={0.15}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ── Cracked Submerged Basalt Stone Foundation ─────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.65, -TOTAL_DEPTH / 2]}
      >
        <planeGeometry args={[80, TOTAL_DEPTH + 90]} />
        <meshStandardMaterial
          color="#0d0805"
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      {/* ── Colonnade Avenue of Fluted Roman Columns ──────── */}
      {colonnades.map((c) => (
        <group key={c.id}>
          {/* Left Column */}
          <ColumnSegment
            position={[-7.5, -1.6, c.z]}
            height={c.leftH}
            radius={0.58}
            isBroken={c.isLeftBroken}
          />
          {/* Right Column */}
          <ColumnSegment
            position={[7.5, -1.6, c.z]}
            height={c.rightH}
            radius={0.58}
            isBroken={c.isRightBroken}
          />

          {/* Random Fallen Column Drum on the floor */}
          {c.isLeftBroken && (
            <FallenColumnDrum position={[-4.5, -1.35, c.z + 2]} rotation={[0, 0.4, Math.PI / 2]} />
          )}
          {c.isRightBroken && (
            <FallenColumnDrum position={[4.2, -1.35, c.z - 2]} rotation={[0, -0.6, Math.PI / 2]} />
          )}
        </group>
      ))}

      {/* ── Monumental Roman Arches spanning overhead ────── */}
      {archPositions.map((a, idx) => (
        <MonumentalArchway key={`arch-${idx}`} position={[0, -1.6, a.z]} width={a.w} height={a.h} />
      ))}

      {/* ── Pantheon Rotunda Ring around the Finale ───────── */}
      {pantheonPillars.map((p, idx) => (
        <ColumnSegment
          key={`pantheon-${idx}`}
          position={[p.x, -1.6, p.z]}
          height={14}
          radius={0.72}
          isBroken={false}
        />
      ))}

      {/* Circular Pantheon Overhead Entablature Ring */}
      <mesh position={[0, 12.8, finaleZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[9.5, 0.9, 16, 48]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Distant Roman Ruins Silhouette Monoliths (Far Left & Right) */}
      {[-24, -20, 20, 24].map((xOffset, idx) => (
        <mesh key={`mono-${idx}`} position={[xOffset, 7, -TOTAL_DEPTH / 2]}>
          <boxGeometry args={[3, 18, TOTAL_DEPTH * 0.9]} />
          <meshStandardMaterial
            color="#100b07"
            roughness={0.98}
            metalness={0.02}
            fog
          />
        </mesh>
      ))}
    </group>
  )
}
