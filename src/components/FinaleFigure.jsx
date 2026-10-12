import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { TOTAL_DEPTH, FINALE_FRACTION } from '../config/sections'

// ACTIVE 3D MODEL PATH:
// Using Meshy AI Hercules Triumphant (8.28 MB optimized game-ready 16k topology).
// Preserves rich embedded AI diffuse stone texture, roughness, and tangent-space normal maps.
const STATUE_MODEL_URL = '/models/Meshy_AI_Hercules_Triumphant_1012183917_texture.glb'
useGLTF.preload(STATUE_MODEL_URL)

const ENERGY_PARTICLE_COUNT = 90

function StatueMesh({ onPointerDown }) {
  const { scene } = useGLTF(STATUE_MODEL_URL)

  const { modelGroup, scale, height } = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Center horizontally and seat cleanly on the plinth base (y = 0)
    clone.position.set(-center.x, -box.min.y, -center.z)

    // Preserve and enhance Meshy AI classical stone PBR materials
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
            child.material.roughness = 0.74
            child.material.metalness = 0.06
            if (child.material.normalMap) {
              child.material.normalScale = new THREE.Vector2(1.15, 1.15)
            }
            child.material.needsUpdate = true
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: '#ebe3d8',
              roughness: 0.68,
              metalness: 0.07,
              bumpScale: 0.04,
            })
          }
        }
      }
    })

    // Heroic statue scale (~4.6 Three.js world units tall)
    const targetHeight = 4.6
    const computedScale = size.y > 0 ? targetHeight / size.y : 1

    return {
      modelGroup: clone,
      scale: computedScale,
      height: targetHeight,
    }
  }, [scene])

  return (
    <group scale={scale}>
      <primitive object={modelGroup} />

      {/* Invisible hit cylinder for seamless 360 drag inspection */}
      <mesh
        position={[0, height * 0.5, 0]}
        onPointerDown={onPointerDown}
        visible={false}
      >
        <cylinderGeometry args={[2.2, 2.2, height * 1.25, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default function FinaleFigure({ cameraZRef }) {
  const groupRef = useRef()
  const rotatorRef = useRef()
  const claudeEmblemRef = useRef()
  const agyEmblemRef = useRef()
  const glowLeftRef = useRef()
  const glowRightRef = useRef()
  const energyRef = useRef()

  const targetYawRef = useRef(0)
  const currentYawRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartYawRef = useRef(0)

  const z = -FINALE_FRACTION * TOTAL_DEPTH

  // 360° Drag interaction handlers
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation()
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    dragStartYawRef.current = targetYawRef.current
    document.body.style.cursor = 'grabbing'
  }, [])

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return
      const deltaX = e.clientX - dragStartXRef.current
      // Smooth 360 inspection sensitivity
      targetYawRef.current = dragStartYawRef.current + deltaX * 0.012
    }

    const handlePointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        document.body.style.cursor = 'auto'
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      document.body.style.cursor = 'auto'
    }
  }, [])

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

    // Continuous turntable spin when user is not actively dragging
    if (!isDraggingRef.current) {
      targetYawRef.current += delta * 0.28
    }

    // Smooth inertia / momentum damping
    currentYawRef.current = THREE.MathUtils.damp(
      currentYawRef.current,
      targetYawRef.current,
      6.0,
      delta
    )

    if (rotatorRef.current) {
      rotatorRef.current.rotation.y = currentYawRef.current
    }

    // Floating levitation bob
    groupRef.current.position.y = 0.9 + Math.sin(time * 0.72) * 0.11

    // Proximity fade
    groupRef.current.traverse((object) => {
      if (object.material && object.material.opacity !== undefined) {
        object.material.opacity = opacity
      }
    })

    // Orbiting celestial AI emblems around the statue
    const orbitAngle = time * 0.72
    const orbitRadius = 2.5
    if (claudeEmblemRef.current) {
      claudeEmblemRef.current.position.x = Math.cos(orbitAngle) * orbitRadius
      claudeEmblemRef.current.position.z = Math.sin(orbitAngle) * orbitRadius
      claudeEmblemRef.current.position.y = 1.9 + Math.sin(time * 1.5) * 0.22
      claudeEmblemRef.current.rotation.y = orbitAngle
    }
    if (agyEmblemRef.current) {
      agyEmblemRef.current.position.x = Math.cos(orbitAngle + Math.PI) * orbitRadius
      agyEmblemRef.current.position.z = Math.sin(orbitAngle + Math.PI) * orbitRadius
      agyEmblemRef.current.position.y = 1.9 + Math.sin(time * 1.5 + Math.PI) * 0.22
      agyEmblemRef.current.rotation.y = orbitAngle + Math.PI
    }

    if (glowLeftRef.current) glowLeftRef.current.intensity = opacity * (6 + Math.sin(time * 3.1) * 1.8)
    if (glowRightRef.current) glowRightRef.current.intensity = opacity * (6 + Math.sin(time * 3.1 + 1.4) * 1.8)

    // Rising transcendence embers
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
      {/* Volumetric Oculus Light Column descending from Pantheon ceiling */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[2.2, 3.8, 14, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffaa66"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating 3D Greek/Roman Stone Statue */}
      <group ref={rotatorRef} position={[0, -0.12, 0]}>
        <StatueMesh onPointerDown={handlePointerDown} />
      </group>

      {/* Classical Roman Fluted Pedestal Plinth beneath the sculpture */}
      <group position={[0, -0.65, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
          <meshStandardMaterial color="#2a1e16" roughness={0.78} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <torusGeometry args={[1.52, 0.02, 12, 32]} />
          <meshStandardMaterial color="#c88d3e" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.35, 1.45, 0.7, 32]} />
          <meshStandardMaterial color="#211710" roughness={0.88} metalness={0.08} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <cylinderGeometry args={[2.0, 2.3, 0.35, 32]} />
          <meshStandardMaterial color="#160e09" roughness={0.92} metalness={0.06} />
        </mesh>
      </group>

      {/* Orbiting Claude-inspired orange energy emblem */}
      <group ref={claudeEmblemRef} position={[-2.5, 2.0, 0]}>
        <pointLight ref={glowLeftRef} color="#ff7a30" distance={6} intensity={6} />
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.24, 0.02, 8, 32]} />
          <meshBasicMaterial color="#ff9a55" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.13, 1]} />
          <meshBasicMaterial color="#ffd0a5" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>

      {/* Orbiting Antigravity-inspired blue-white energy emblem */}
      <group ref={agyEmblemRef} position={[2.5, 2.0, 0]}>
        <pointLight ref={glowRightRef} color="#5ba3ff" distance={6} intensity={6} />
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.24, 0.02, 8, 32]} />
          <meshBasicMaterial color="#79b8ff" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.14, 0]} />
          <meshBasicMaterial color="#e3f1ff" transparent opacity={1} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>

      {/* Rising Transcendence Embers */}
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
