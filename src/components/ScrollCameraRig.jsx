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
          zStation,
          stationP: p,
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
          zStation,
          stationP: p,
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
          zStation,
          stationP: p,
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
          zStation,
          stationP: p,
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
        zStation,
        stationP: p,
      }
    }
  }

  // Outside chambers: walking along the open central colonnade
  let targetZ = -progress * TOTAL_DEPTH

  // Finale Transcendence Station: camera glides forward and holds optimal frontal exhibition distance
  if (progress >= 0.88) {
    const finaleZ = -0.95 * TOTAL_DEPTH // -171.0
    const targetStopZ = finaleZ + (isMobile ? 8.2 : 7.2) // ~ -163.8m
    if (progress >= 0.93) {
      targetZ = targetStopZ
    } else {
      const tApproach = (progress - 0.88) / 0.05
      targetZ = lerp(-0.88 * TOTAL_DEPTH, targetStopZ, smooth(tApproach))
    }
  }

  return {
    x: 0,
    z: targetZ,
    yaw: 0,
    isInside: false,
    activeSinIndex: -1,
    side: 1,
    zStation: targetZ,
    stationP: -1,
  }
}

export default function ScrollCameraRig({ scrollRef, cameraZRef }) {
  const mouseXRef = useRef(0)
  const currentPos = useRef(new THREE.Vector3(0, 1.6, 0))
  const currentLook = useRef(new THREE.Vector3(0, 1.55, -10))
  const reducedMotionRef = useRef(false)

  // Mobile horizontal swipe gesture & quick toggle pan controller
  // panTarget: -1.0 (focus on portrait) .. 0.0 (room wide view) .. +1.0 (focus on tablet)
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
          // Swiping right steers towards portrait (-1.0), swiping left steers towards tablet (+1.0)
          const sensitivity = 0.0055
          panTargetRef.current = THREE.MathUtils.clamp(
            panTargetRef.current - dx * sensitivity,
            -1.0,
            1.0
          )
          touchStartXRef.current = e.touches[0].clientX
        }
      }
    }

    // Custom event listener for mobile & desktop quick-toggle pill buttons
    const handleCustomPan = (e) => {
      if (typeof e.detail?.target === 'number') {
        panTargetRef.current = THREE.MathUtils.clamp(e.detail.target, -1.0, 1.0)
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
    const targetFov = isMobile
      ? Math.min(74, 56 + Math.max(0, 1.0 - aspect) * 22)
      : 56

    if (Math.abs(state.camera.fov - targetFov) > 0.1) {
      state.camera.fov = THREE.MathUtils.damp(state.camera.fov, targetFov, 4.0, delta)
      state.camera.updateProjectionMatrix()
    }

    const transform = getCameraStationTransform(rawProgress, isMobile)
    isInsideRoomRef.current = transform.isInside
    const t = state.clock.elapsedTime

    // Walking footsteps bob
    const isMoving =
      Math.abs(currentPos.current.z - transform.z) > 0.02 ||
      Math.abs(currentPos.current.x - transform.x) > 0.02
    const movingAmount = isMoving ? 1.0 : 0.2
    const motionAmount = reducedMotionRef.current ? 0 : movingAmount
    const bob = Math.sin(t * 2.4) * 0.03 * motionAmount

    // Elevation & gaze adjustment for the Finale Transcendence scene
    // Elevates camera from walking eye-level (1.6) to model chest/eye level (2.75 - 2.85)
    let camY = 1.6
    let lookY = 1.55
    let lookZ = transform.z - Math.cos(transform.yaw) * 10

    if (rawProgress >= 0.88) {
      const finaleP = THREE.MathUtils.clamp((rawProgress - 0.88) / 0.055, 0, 1)
      const blend = smooth(finaleP)
      camY = THREE.MathUtils.lerp(1.6, isMobile ? 2.55 : 2.8, blend)
      lookY = THREE.MathUtils.lerp(1.55, isMobile ? 2.65 : 2.9, blend)
      const finaleStatueZ = -0.95 * TOTAL_DEPTH
      lookZ = THREE.MathUtils.lerp(transform.z - 10, finaleStatueZ, blend)
    }

    // Default Colonnade Walk Target Camera & Look Position
    const defaultCam = new THREE.Vector3(transform.x, camY, transform.z)
    const defaultLook = new THREE.Vector3(
      transform.x + Math.sin(transform.yaw) * 10,
      lookY,
      lookZ
    )

    let finalCamTarget = defaultCam
    let finalLookTarget = defaultLook

    // If inside or transitioning through a temple chamber, compute exact room-specific targets
    if (transform.activeSinIndex >= 0 && transform.stationP !== undefined) {
      const p = transform.stationP
      const isLeft = transform.side === -1
      const side = transform.side
      const zStation = transform.zStation

      // Smooth damp pan target: -1 (portrait) .. 0 (room) .. +1 (tablet)
      const effectivePanTarget = transform.isInside ? panTargetRef.current : 0
      currentPanRef.current = THREE.MathUtils.damp(
        currentPanRef.current,
        effectivePanTarget,
        5.5,
        delta
      )

      // ── ROOM VIEW TARGETS ───────────────────────────────────
      // 1. Portrait Mode: camera glides in front of Saurav's character stele
      const portraitCam = new THREE.Vector3(
        side * (isMobile ? 6.2 : 6.8),
        1.55,
        zStation + (isLeft ? 3.0 : -3.0)
      )
      const portraitLook = new THREE.Vector3(
        side * 10.1,
        1.4,
        zStation + (isLeft ? 4.3 : -4.3)
      )

      // 2. Room Mode: panoramic wide sanctuary view (framing tablet + portrait together)
      const roomCam = new THREE.Vector3(
        side * (isMobile ? 4.8 : 5.4),
        1.6,
        zStation + (isLeft ? 0.8 : -0.8)
      )
      const roomLook = new THREE.Vector3(
        side * 10.3,
        1.4,
        zStation + (isLeft ? 1.8 : -1.8)
      )

      // 3. Tablet Mode: camera glides squarely in front of the Opus Quadratum brick tablet
      const tabletCam = new THREE.Vector3(
        side * (isMobile ? 5.8 : 6.5),
        1.55,
        zStation + (isLeft ? -0.8 : 0.8)
      )
      const tabletLook = new THREE.Vector3(
        side * 10.4,
        1.4,
        zStation
      )

      // Interpolate between Room, Portrait, and Tablet based on currentPanRef
      const pan = currentPanRef.current
      const activeCam = new THREE.Vector3()
      const activeLook = new THREE.Vector3()

      if (pan < 0) {
        const factor = Math.min(1, Math.max(0, -pan))
        activeCam.lerpVectors(roomCam, portraitCam, factor)
        activeLook.lerpVectors(roomLook, portraitLook, factor)
      } else {
        const factor = Math.min(1, Math.max(0, pan))
        activeCam.lerpVectors(roomCam, tabletCam, factor)
        activeLook.lerpVectors(roomLook, tabletLook, factor)
      }

      // Smoothly blend into the room view during entry and exit
      let roomBlend = 0
      if (p >= 0.20 && p < 0.38) {
        roomBlend = smooth((p - 0.20) / 0.18)
      } else if (p >= 0.38 && p < 0.66) {
        roomBlend = 1.0
      } else if (p >= 0.66 && p < 0.84) {
        roomBlend = 1.0 - smooth((p - 0.66) / 0.18)
      }

      finalCamTarget = new THREE.Vector3().lerpVectors(defaultCam, activeCam, roomBlend)
      finalLookTarget = new THREE.Vector3().lerpVectors(defaultLook, activeLook, roomBlend)
    }

    // Interactive mouse parallax look
    if (!reducedMotionRef.current) {
      finalLookTarget.z += mouseXRef.current * 0.35
    }

    // Smooth inertia damping on camera position and look target
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, finalCamTarget.x, 5.0, delta)
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, finalCamTarget.y, 5.0, delta)
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, finalCamTarget.z, 5.0, delta)

    currentLook.current.x = THREE.MathUtils.damp(currentLook.current.x, finalLookTarget.x, 5.0, delta)
    currentLook.current.y = THREE.MathUtils.damp(currentLook.current.y, finalLookTarget.y, 5.0, delta)
    currentLook.current.z = THREE.MathUtils.damp(currentLook.current.z, finalLookTarget.z, 5.0, delta)

    state.camera.position.set(
      currentPos.current.x,
      currentPos.current.y + bob,
      currentPos.current.z
    )
    state.camera.lookAt(currentLook.current.x, currentLook.current.y, currentLook.current.z)

    if (cameraZRef) {
      cameraZRef.current = currentPos.current.z
    }
  })

  return null
}
