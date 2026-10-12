import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import { useRef, Suspense } from 'react'
import RomanRuins from './RomanRuins'
import Embers from './Embers'
import FirePillars from './FirePillars'
import HeatHaze from './HeatHaze'
import ScrollCameraRig from './ScrollCameraRig'
import RomanRoom from './RomanRoom'
import FinaleFigure from './FinaleFigure'
import { WAYPOINTS, TOTAL_DEPTH } from '../config/sections'

export default function Scene({ scrollRef }) {
  const cameraZRef = useRef(0)

  return (
    <Canvas
      camera={{ fov: 56, near: 0.1, far: 280, position: [0, 1.6, 0] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={['#0c0806']} />
      <fog attach="fog" args={['#0e0906', 15, 120]} />

      <ambientLight color="#3d2618" intensity={1.0} />
      <directionalLight position={[14, 30, -15]} color="#ff904d" intensity={1.2} />
      <directionalLight position={[-16, 22, -50]} color="#e06828" intensity={0.75} />
      <directionalLight position={[0, 20, -120]} color="#ffaa66" intensity={0.9} />

      <Suspense fallback={null}>
        {/* Real 3D Procedural Roman Architecture */}
        <RomanRuins />

        {/* GLSL Atmospheric Heat Shimmer */}
        <HeatHaze />

        {/* Dual Ember & Ash Particle Field */}
        <Embers cameraZRef={cameraZRef} />

        {/* Roman Torch Fire Pillars along Colonnade */}
        <FirePillars />

        {/* The 7 Deadly Sins Roman Temple Chambers (Side Rooms with Gates) */}
        {WAYPOINTS.map((w, i) => (
          <RomanRoom
            key={w.id}
            waypoint={w}
            index={i}
            chamberZ={-w.fraction * TOTAL_DEPTH}
            cameraZRef={cameraZRef}
          />
        ))}

        {/* Transcendence Finale in Pantheon Oculus */}
        <FinaleFigure cameraZRef={cameraZRef} />

        {/* Mousham-style Camera Rig with Station Pauses */}
        <ScrollCameraRig scrollRef={scrollRef} cameraZRef={cameraZRef} />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.65}
          luminanceThreshold={0.68}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <DepthOfField
          focusDistance={0.016}
          focalLength={0.024}
          bokehScale={1.3}
          height={480}
        />
        <Vignette eskil={false} offset={0.14} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  )
}
