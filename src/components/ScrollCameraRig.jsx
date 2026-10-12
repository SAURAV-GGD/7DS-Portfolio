import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TOTAL_DEPTH, WAYPOINTS } from '../config/sections'

const STATION_RADIUS = 0.048 // Scroll window for each temple chamber interaction

// Smooth cubic Hermite interpolation
function smooth(x) {
  const c = Math.max(0, Math.min(1, x))
  return c * c * (3 - 2 * c)
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Computes exact 3D camera path and yaw for the 7 Deadly Sins temple chambers:
 * 1. Approach along central colonnade (Z axis, yaw = 0).
 * 2. Turn 90 degrees (yaw = ±PI/2) toward the side room entrance gate.
 * 3. Cross gate into the enclosed Roman chamber.
 * 4. Sanctuary hold: resting in front of the 3D Carved Stone Tablet & torches.
 * 5. Turn and exit the chamber back to the corridor (yaw turns back to 0).
 * 6. Realign with the main colonnade and resume forward walk.
 */
function getCameraStationTransform(progress, isMobile = false) {
  // On mobile screens, pull camera back slightly inside the room for wider framing
  const roomEntryDepth = isMobile ? 5.3 : 6.6

  // Check if inside any of the 7 sin chambers
  for (let i = 0; i < WAYPOINTS.length; i++) {
    const w = WAYPOINTS[i]
    const zStation = -w.fraction * TOTAL_DEPTH
    const pStart = w.fraction - STATION_RADIUS
    const pEnd = w.fraction + STATION_RADIUS

    if (progress >= pStart && progress <= pEnd) {
      const p = (progress - pStart) / (pEnd - pStart) // 0.0 .. 1.0 within room station
      const isLeft = i % 2 === 0
      const side = isLeft ? -1 : 1
      const enterYaw = side * (Math.PI / 2) // -90° (left) or +90° (right)

      // Phase 1: Approach along corridor & turn 90° toward the gate [0.00 .. 0.20]
      if (p < 0.20) {
        const s = smooth(p / 0.20)
        return {
          x: lerp(0, side * 1.6, s),
          z: lerp(zStation + 2.8, zStation, s),
          yaw: lerp(0, enterYaw, s),
          isInside: s > 0.5,
          activeSinIndex: i,
          side,
        }
      }

      // Phase 2: Enter through the monumental gate into the room [0.20 .. 0.38]
      if (p < 0.38) {
        const s = smooth((p - 0.20) / 0.18)
        return {
          x: lerp(side * 1.6, side * roomEntryDepth, s),
          z: zStation,
          yaw: enterYaw,
          isInside: true,
          activeSinIndex: i,
          side,
        }
      }

      // Phase 3: Reading Hold in Sanctuary facing the Carved Stone Tablet [0.38 .. 0.66]
      if (p < 0.66) {
        return {
          x: side * roomEntryDepth,
          z: zStation,
          yaw: enterYaw,
          isInside: true,
          activeSinIndex: i,
          side,
        }
      }

      // Phase 4: Turn and walk out of the room back to corridor [0.66 .. 0.84]
      if (p < 0.84) {
        const s = smooth((p - 0.66) / 0.18)
        return {
          x: lerp(side * roomEntryDepth, 0, s),
          z: zStation,
          yaw: lerp(enterYaw, 0, s),
          isInside: s < 0.5,
          activeSinIndex: i,
          side,
        }
      }

      // Phase 5: Realign with the forward colonnade [0.84 .. 1.00]
      const s = smooth((p - 0.84) / 0.16)
      return {
        x: 0,
        z: lerp(zStation, zStation - 2.8, s),
        yaw: 0,
        isInside: false,
        activeSinIndex: i,
        side,
      }
    }
  }

  // Outside chambers: walking along the open central colonnade
  const targetZ = -progress * TOTAL_DEPTH
  return {
    x: 0,
    z: targetZ,
    yaw: 0,
    isInside: false,
    activeSinIndex: -1,
    side: 1,
  }
}

export default function ScrollCameraRig({ scrollRef, cameraZRef }) {
  const mouseXRef = useRef(0)
  const currentPos = useRef(new THREE.Vector3(0, 1.6, 0))
  const currentYaw = useRef(0)
  const reducedMotionRef = useRef(false)

  // Mobile horizontal swipe gesture & quick toggle pan controller
  // panTarget: -1.0 (focus on portrait) .. 0.0 (center) .. +1.0 (focus on tablet)
  const panTargetRef = useRef(0)
  const currentPanRef = useRef(0)
  const isInsideRoomRef = useRef(false)
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const isHorizontalSwipeRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => {
      reducedMotionRef.current = media.matches
    }
    const trackPointer = (event) => {
      // Desktop mouse parallax
      if (event.pointerType === 'mouse') {
        mouseXRef.current = (event.clientX / window.innerWidth - 0.5) * 2
      }
    }

    // Touch gesture handlers for mobile horizontal swipe
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartXRef.current = e.touches[0].clientX
        touchStartYRef.current = e.touches[0].clientY
        isHorizontalSwipeRef.current = false
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length === 1 && isInsideRoomRef.current) {
        const dx = e.touches[0].clientX - touchStartXRef.current
        const dy = e.touches[0].clientY - touchStartYRef.current

        // If swipe is primarily horizontal, steer the camera between portrait and tablet
        if (Math.abs(dx) > Math.abs(dy) * 1.2 || isHorizontalSwipeRef.current) {
          isHorizontalSwipeRef.current = true
          // Natural pan: swiping right reveals the portrait on the left (-), swiping left reveals tablet (+)
          const sensitivity = 0.0055
          panTargetRef.current = THREE.MathUtils.clamp(
            panTargetRef.current - dx * sensitivity,
            -1.2,
            1.1
          )
          touchStartXRef.current = e.touches[0].clientX
        }
      }
    }

    // Custom event listener for mobile quick-toggle pill buttons
    const handleCustomPan = (e) => {
      if (typeof e.detail?.target === 'number') {
        panTargetRef.current = e.detail.target
      }
    }

    updateMotion()
    media.addEventListener('change', updateMotion)
    window.addEventListener('pointermove', trackPointer, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('7ds-mobile-pan', handleCustomPan)

    return () => {
      media.removeEventListener('change', updateMotion)
      window.removeEventListener('pointermove', trackPointer)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('7ds-mobile-pan', handleCustomPan)
    }
  }, [])

  useFrame((state, delta) => {
    const rawProgress = scrollRef.current

    // Detect mobile viewport aspect ratio
    const aspect = state.size.width / Math.max(1, state.size.height)
    const isMobile = aspect < 1.0

    // Adaptive Camera Framing on Mobile Viewports
    // Dynamically widens FOV on portrait phone screens so both portrait and tablet are visible
    const targetFov = isMobile
      ? Math.min(76, 56 + Math.max(0, 1.0 - aspect) * 26)
      : 56

    if (Math.abs(state.camera.fov - targetFov) > 0.1) {
      state.camera.fov = THREE.MathUtils.damp(state.camera.fov, targetFov, 4.0, delta)
      state.camera.updateProjectionMatrix()
    }

    const transform = getCameraStationTransform(rawProgress, isMobile)
    isInsideRoomRef.current = transform.isInside
    const t = state.clock.elapsedTime

    // Walking footsteps bob and subtle camera sway
    const isMoving =
      Math.abs(currentPos.current.z - transform.z) > 0.02 ||
      Math.abs(currentPos.current.x - transform.x) > 0.02
    const movingAmount = isMoving ? 1.0 : 0.2
    const motionAmount = reducedMotionRef.current ? 0 : movingAmount
    const bob = Math.sin(t * 2.4) * 0.03 * motionAmount
    const sway = Math.sin(t * 1.2) * 0.025 * motionAmount

    // Smooth inertia damping on camera position and yaw rotation
    currentPos.current.x = THREE.MathUtils.damp(
      currentPos.current.x,
      transform.x + sway,
      5.5,
      delta
    )

    // Apply mobile horizontal pan offset when inside the room
    // panTarget: -1.0 (focus on portrait) .. 0.0 (center) .. +1.0 (focus on tablet)
    const effectivePanTarget = transform.isInside ? panTargetRef.current : 0
    currentPanRef.current = THREE.MathUtils.damp(
      currentPanRef.current,
      effectivePanTarget,
      5.5,
      delta
    )

    // Calculate dynamic yaw rotation including mobile pan and mouse look
    const sideSign = transform.side === -1 ? 1 : -1
    const mobileYawOffset = currentPanRef.current * (isMobile ? 0.38 : 0.20) * sideSign
    const mouseLook = reducedMotionRef.current ? 0 : mouseXRef.current * 0.12

    currentPos.current.z = THREE.MathUtils.damp(
      currentPos.current.z,
      transform.z,
      5.5,
      delta
    )
    currentYaw.current = THREE.MathUtils.damp(
      currentYaw.current,
      transform.yaw + mobileYawOffset,
      5.5,
      delta
    )

    const effectiveYaw = currentYaw.current + mouseLook

    // Position camera at natural eye level
    state.camera.position.set(
      currentPos.current.x,
      1.6 + bob,
      currentPos.current.z
    )

    // Look along the dynamic yaw direction
    const lookDistance = 10
    const lookX = currentPos.current.x + Math.sin(effectiveYaw) * lookDistance
    const lookZ = currentPos.current.z - Math.cos(effectiveYaw) * lookDistance

    state.camera.lookAt(lookX, 1.55, lookZ)

    if (cameraZRef) {
      cameraZRef.current = currentPos.current.z
    }
  })

  return null
}
