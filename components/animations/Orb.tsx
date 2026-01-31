
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const OrbMesh = ({ color = "#6366f1", speed = 2, distort = 0.4 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0}
      />
    </Sphere>
  );
};

interface OrbProps {
  color?: string;
  speed?: number;
  distort?: number;
  className?: string;
}

const Orb: React.FC<OrbProps> = ({ color, speed, distort, className }) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* @ts-ignore - Intrinsic elements for React Three Fiber */}
        <ambientLight intensity={1} />
        {/* @ts-ignore - Intrinsic elements for React Three Fiber */}
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        {/* @ts-ignore - Intrinsic elements for React Three Fiber */}
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <OrbMesh color={color} speed={speed} distort={distort} />
        </Float>
      </Canvas>
    </div>
  );
};

export default Orb;
