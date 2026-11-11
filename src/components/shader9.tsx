"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cn } from "cn";

interface ShaderPlaneProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: { value: unknown } };
}

const ShaderPlane = ({
  vertexShader,
  fragmentShader,
  uniforms,
}: ShaderPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const mouseLerp = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      const width = Math.max(size.width, 1);
      const height = Math.max(size.height, 1);
      material.uniforms.u_resolution.value.set(width, height, 1.0);

      const aspect = width / height;
      const targetX = state.pointer.x * aspect;
      const targetY = state.pointer.y;

      mouseLerp.current.lerp(new THREE.Vector2(targetX, targetY), 0.1);

      material.uniforms.u_mouse.value.copy(mouseLerp.current);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

interface ShaderBackgroundProps {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: { [key: string]: { value: unknown } };
  className?: string;
}

const Shader9 = ({
  vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
    gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    uniform float u_time;
    uniform vec3 u_resolution;
    uniform vec2 u_mouse;

    #define T u_time / 2.0
    #define PI 3.141596
    #define TAU 6.283185
    #define S smoothstep
    const float EPSILON = 1e-6;

    mat2 rotate(float a){
      float s = sin(a);
      float c = cos(a);
      return mat2(c,-s,s,c);
    }

    void mainImage(out vec4 O, in vec2 I){
      vec2 R = u_resolution.xy;
      vec2 uv = (I*2.0 - R) / R.y;

      O.rgb = vec3(0.05, 0.05, 0.1);
      O.a = 1.0;

      vec3 ro = vec3(0.0, 0.0, -13.0);
      vec3 rd = normalize(vec3(uv, 1.0));

      float zMax = 20.0;
      float z = 0.1;

      vec3 col = vec3(0.05, 0.05, 0.075);
      float glow = 0.0;

      for (float i = 0.0; i < 100.0; i++) {
        vec3 p = ro + rd * z;

        p.xz = rotate(p.y * 0.4 + T) * p.xz;

        float ang = acos(clamp(p.x / 4.0, -1.0, 1.0));
        float n = 6.0;
        float doff = cos(ang * n);

        float d = length(p) - (6.0 + doff * 0.6);
        d = abs(d) + 0.1;

        vec3 c = (0.7 + 0.5 * sin(vec3(2, 1, 1) + p.x));
        glow += pow(0.015 / d, 2.0);
        col += glow * c;

        if (d < 0.5) {
        float distToMouse = length(uv - u_mouse);
        float influence = 1.0 - smoothstep(0.0, 0.5, distToMouse); 
        col = mix(col, vec3(1.0, 0.0, 0.0), influence);
    }

        if (d < EPSILON || z > zMax) break;
        z += max(d * 0.1, EPSILON * 2.0);
      }

      col = col / (1.0 + col);
      O.rgb = col;
    }
      

    void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
    }
  `,
  uniforms = {},
  className,
}: ShaderBackgroundProps) => {
  const shaderUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      ...uniforms,
    }),
    [uniforms],
  );

  return (
    <section
      className={cn(
        "relative h-svh max-h-[1200px] min-h-[600px] w-full overflow-hidden",
        className,
      )}
    >
      <Canvas
        className="absolute inset-0 size-full"
        gl={{ antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1] }}
      >
        <ShaderPlane
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={shaderUniforms}
        />
      </Canvas>
    </section>
  );
};

export { Shader9 };
