"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Rotating starfield / particle field
function Particles({ count = 1800 }: { count?: number }) {
    const ref = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 30;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return arr;
    }, [count]);

    useFrame((state) => {
        ref.current.rotation.y = state.clock.elapsedTime * 0.018;
        ref.current.rotation.x = state.clock.elapsedTime * 0.009;
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#33D69F"
                size={0.025}
                sizeAttenuation
                depthWrite={false}
                opacity={0.45}
            />
        </Points>
    );
}

// Large central icosahedron — double-layered (solid + wireframe overlay)
function MainShape() {
    const solidRef = useRef<THREE.Mesh>(null!);
    const wireRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        solidRef.current.rotation.x = t * 0.08;
        solidRef.current.rotation.y = t * 0.12;
        wireRef.current.rotation.x = t * 0.08;
        wireRef.current.rotation.y = t * 0.12;
    });

    return (
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
            {/* Solid fill */}
            <mesh ref={solidRef} position={[2.2, 0, 0]}>
                <icosahedronGeometry args={[1.9, 1]} />
                <meshStandardMaterial
                    color="#0E5A45"
                    transparent
                    opacity={0.18}
                    emissive="#33D69F"
                    emissiveIntensity={0.22}
                    roughness={0.15}
                    metalness={0.9}
                />
            </mesh>
            {/* Wireframe outline */}
            <mesh ref={wireRef} position={[2.2, 0, 0]}>
                <icosahedronGeometry args={[1.92, 1]} />
                <meshStandardMaterial
                    color="#33D69F"
                    wireframe
                    transparent
                    opacity={0.28}
                    emissive="#33D69F"
                    emissiveIntensity={0.6}
                />
            </mesh>
        </Float>
    );
}

// Distorted sphere — organic / fluid Spline-like feel
function DistortedSphere() {
    return (
        <Float speed={2.2} rotationIntensity={0.5} floatIntensity={0.9}>
            <mesh position={[-2.8, 0.6, -1.5]}>
                <sphereGeometry args={[0.7, 64, 64]} />
                <MeshDistortMaterial
                    color="#33D69F"
                    distort={0.55}
                    speed={2}
                    transparent
                    opacity={0.35}
                    emissive="#33D69F"
                    emissiveIntensity={0.5}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
}

// Torus ring — accent piece
function FloatingTorus() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = t * 0.35;
        ref.current.rotation.z = t * 0.22;
    });

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={1.1}>
            <mesh ref={ref} position={[4.2, 1.8, -0.8]}>
                <torusGeometry args={[0.55, 0.16, 16, 70]} />
                <meshStandardMaterial
                    color="#33D69F"
                    transparent
                    opacity={0.65}
                    emissive="#33D69F"
                    emissiveIntensity={0.9}
                    roughness={0.05}
                    metalness={0.95}
                />
            </mesh>
        </Float>
    );
}

// Octahedron — secondary geometric accent
function FloatingOctahedron() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = t * 0.45;
        ref.current.rotation.y = t * 0.3;
    });

    return (
        <Float speed={1.8} rotationIntensity={0.9} floatIntensity={0.65}>
            <mesh ref={ref} position={[-0.8, 2.5, -1.8]}>
                <octahedronGeometry args={[0.52]} />
                <meshStandardMaterial
                    color="#7FE8C7"
                    transparent
                    opacity={0.55}
                    emissive="#7FE8C7"
                    emissiveIntensity={0.7}
                    roughness={0.1}
                    metalness={0.85}
                />
            </mesh>
        </Float>
    );
}

// Torus knot — complex Spline-like shape
function FloatingTorusKnot() {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = t * 0.18;
        ref.current.rotation.y = t * 0.28;
    });

    return (
        <Float speed={2.8} rotationIntensity={0.35} floatIntensity={0.8}>
            <mesh ref={ref} position={[0.5, -2.8, -1.2]}>
                <torusKnotGeometry args={[0.38, 0.11, 120, 16]} />
                <meshStandardMaterial
                    color="#33D69F"
                    transparent
                    opacity={0.45}
                    emissive="#33D69F"
                    emissiveIntensity={0.7}
                    roughness={0.08}
                    metalness={0.92}
                    wireframe
                />
            </mesh>
        </Float>
    );
}

// Small glowing sphere nodes
function GlowNode({ position }: { position: [number, number, number] }) {
    return (
        <Float speed={3} rotationIntensity={0} floatIntensity={1.2}>
            <mesh position={position}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color="#33D69F"
                    emissive="#33D69F"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.9}
                />
            </mesh>
        </Float>
    );
}

// Smooth mouse-parallax + scroll-parallax camera rig
function CameraRig() {
    const { camera } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const smoothed = useRef({ x: 0, y: 0 });
    const scrollZ = useRef(0);
    const targetScrollZ = useRef(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1.8;
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 1.2;
        };
        const onScroll = () => {
            // Pull camera back (increase Z) as user scrolls down — max +3 units
            const progress = Math.min(window.scrollY / window.innerHeight, 1);
            targetScrollZ.current = progress * 3;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useFrame(() => {
        smoothed.current.x += (mouse.current.x - smoothed.current.x) * 0.04;
        smoothed.current.y += (mouse.current.y - smoothed.current.y) * 0.04;
        scrollZ.current += (targetScrollZ.current - scrollZ.current) * 0.06;

        camera.position.x = smoothed.current.x;
        camera.position.y = smoothed.current.y;
        camera.position.z = 7 + scrollZ.current;
        camera.lookAt(0, 0, 0);
    });

    return null;
}

export function HeroScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 7], fov: 55 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[6, 6, 6]} color="#33D69F" intensity={2.5} />
            <pointLight position={[-6, -4, -4]} color="#0B3D2E" intensity={1.5} />
            <pointLight position={[0, 4, 3]} color="#7FE8C7" intensity={1} />

            {/* Scene objects */}
            <CameraRig />
            <Particles />
            <MainShape />
            <DistortedSphere />
            <FloatingTorus />
            <FloatingOctahedron />
            <FloatingTorusKnot />

            {/* Glowing nodes scattered around */}
            <GlowNode position={[3.5, -1.2, 0.5]} />
            <GlowNode position={[-1.5, -1.8, 0.3]} />
            <GlowNode position={[1.2, 2.8, -0.5]} />
            <GlowNode position={[-3.2, 1.5, -0.8]} />
            <GlowNode position={[4.8, 0.5, -1]} />
        </Canvas>
    );
}
