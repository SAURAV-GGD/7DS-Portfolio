import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const heatHazeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const heatHazeFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * 0.0243902439) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    float n1 = snoise(vec2(vUv.x * 4.0, vUv.y * 6.0 - uTime * 0.45));
    float n2 = snoise(vec2(vUv.x * 8.0 + uTime * 0.2, vUv.y * 12.0 - uTime * 0.8));
    float combinedNoise = (n1 * 0.7 + n2 * 0.3);
    
    // Falloff near borders and top
    float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
    float verticalFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.4, vUv.y);
    float alpha = max(0.0, combinedNoise * 0.12) * edgeFade * verticalFade;

    vec3 warmColor = mix(uColor, vec3(1.0, 0.55, 0.2), n2 * 0.5 + 0.5);
    gl_FragColor = vec4(warmColor, alpha);
  }
`

export default function HeatHaze() {
  const materialRef = useRef()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <group>
      {/* Ground heat haze sheets along the pathway */}
      {[25, 60, 95, 130, 165].map((zPos, idx) => (
        <mesh key={idx} position={[0, -0.6, -zPos]} rotation={[-Math.PI / 2.3, 0, 0]}>
          <planeGeometry args={[26, 32, 16, 16]} />
          <shaderMaterial
            ref={idx === 0 ? materialRef : undefined}
            vertexShader={heatHazeVertexShader}
            fragmentShader={heatHazeFragmentShader}
            uniforms={{
              uTime: { value: 0 },
              uColor: { value: new THREE.Color('#ff5511') },
            }}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
