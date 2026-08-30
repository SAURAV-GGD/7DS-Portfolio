import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { TOTAL_DEPTH } from '../config/sections'

export default function ScrollCameraRig({ scrollRef, cameraZRef }) {
  const { camera } = useThree()
  const mouseXRef = useRef(0)
  const headTurnRef = useRef(0)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => {
      reducedMotionRef.current = media.matches
    }
    const trackPointer = (event) => {
      mouseXRef.current = (event.clientX / window.innerWidth - 0.5) * 2
    }

    updateMotion()
    media.addEventListener('change', updateMotion)
    window.addEventListener('pointermove', trackPointer, { passive: true })

    return () => {
      media.removeEventListener('change', updateMotion)
      window.removeEventListener('pointermove', trackPointer)
    }
  }, [])

  useFrame((state) => {
    const progress = scrollRef.current
    const targetZ = -progress * TOTAL_DEPTH
    const t = state.clock.elapsedTime

    // Walking bob (vertical) + sway (horizontal), damped footstep feel
    const movingAmount = Math.min(progress * 6, 1)
    const motionAmount = reducedMotionRef.current ? 0 : movingAmount
    const bob = Math.sin(t * 2.4) * 0.05 * motionAmount
    const sway = Math.sin(t * 1.2) * 0.08 * motionAmount

    // Mouse parallax — subtle head-turn (max ±3 degrees)
    const targetHeadTurn = reducedMotionRef.current ? 0 : mouseXRef.current * 0.05
    headTurnRef.current = THREE.MathUtils.damp(
      headTurnRef.current,
      targetHeadTurn,
      8,
      state.clock.getDelta()
    )
    const headTurn = headTurnRef.current

    camera.position.z = targetZ
    camera.position.y = 1.6 + bob
    camera.position.x = sway + headTurn * 0.5

    // Look forward with slight head-turn offset
    camera.lookAt(
      sway * 0.5 + headTurn * 2,
      1.5,
      targetZ - 10
    )

    if (cameraZRef) cameraZRef.current = targetZ
  })

  return null
}
