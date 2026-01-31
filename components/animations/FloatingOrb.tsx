
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const OrbWithParticles = ({ mousePos }: { mousePos: { x: number, y: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate random particles
  const particles = useMemo(() => {
    const temp = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 10;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Parallax mouse effect
      const targetX = mousePos.x * 0.5;
      const targetY = mousePos.y * 0.5;
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
      
      meshRef.current.rotation.x = time * 0.1;
      meshRef.current.rotation.y = time * 0.15;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
          <MeshDistortMaterial
            color="#a5b4fc"
            speed={2}
            distort={0.4}
            radius={1}
            roughness={0.1}
            metalness={0.2}
          />
        </Sphere>
      </Float>

      <Points ref={particlesRef} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </>
  );
};

const FloatingOrbScene: React.FC = () => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePos({ x, y });
  };

  return (
    <div className="w-full h-full" onMouseMove={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* @ts-ignore - Intrinsic elements for React Three Fiber */}
        <ambientLight intensity={0.5} />
        {/* @ts-ignore - Intrinsic elements for React Three Fiber */}
        <pointLight position={[10, 10, 10]} intensity={2} color="#818cf8" />
        {/* @ts-ignore - Intrinsic elements for React Three Fiber */}
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <OrbWithParticles mousePos={mousePos} />
      </Canvas>
    </div>
  );
};

export default FloatingOrbScene;
