import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import { useRef } from 'react'
import Wasteland from './Wasteland'
import Embers from './Embers'
import FirePillars from './FirePillars'
import ScrollCameraRig from './ScrollCameraRig'
import SinPortrait from './SinPortrait'
import FinaleFigure from './FinaleFigure'
import { WAYPOINTS } from '../config/sections'

export default function Scene({ scrollRef }) {
  const cameraZRef = useRef(0)

  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 250, position: [0, 1.6, 0] }}
      gl={{ antialias: true, alpha: true }}
    >
      <Wasteland />
      <Embers cameraZRef={cameraZRef} />
      <FirePillars />

      {WAYPOINTS.map((w, i) => (
        <SinPortrait
          key={w.id}
          waypoint={w}
          cameraZRef={cameraZRef}
          side={i % 2 === 0 ? 'right' : 'left'}
        />
      ))}

      <FinaleFigure cameraZRef={cameraZRef} />

      <ScrollCameraRig scrollRef={scrollRef} cameraZRef={cameraZRef} />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <DepthOfField
          focusDistance={0.018}
          focalLength={0.025}
          bokehScale={1.4}
          height={480}
        />
        <Vignette eskil={false} offset={0.12} darkness={1.0} />
      </EffectComposer>
    </Canvas>
  )
}
