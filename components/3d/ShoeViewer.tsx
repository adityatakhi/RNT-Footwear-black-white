"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { Product } from "@/lib/products";

const upperColors: Record<Product["tone"], string> = { chalk: "#e5e5e5", volt: "#c8c8c8", ember: "#a4a4a4", slate: "#444444" };

function ShoeModel({ src, tone }: { src: string; tone: Product["tone"] }) {
  const { scene } = useGLTF(src);
  const model = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => {
    model.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;
      const remap = (material: THREE.Material) => {
        const clone = material.clone();
        if (clone instanceof THREE.MeshStandardMaterial && /upper|mesh|fabric|body/i.test(material.name)) clone.color.set(upperColors[tone]);
        return clone;
      };
      node.material = Array.isArray(node.material) ? node.material.map(remap) : remap(node.material);
    });
  }, [model, tone]);
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => { if (group.current) group.current.rotation.y += delta * (state.pointer.x * 0.12 + 0.025); });
  return <group ref={group} rotation={[0.05, -0.3, 0]}><primitive object={model} scale={1.15} position={[0, -0.22, 0]}/></group>;
}

export function ShoeLighting() { return <><ambientLight intensity={0.65}/><directionalLight castShadow position={[3, 5, 5]} intensity={2.2} shadow-mapSize={[1024, 1024]}/><pointLight position={[-3, 1, -2]} intensity={0.8} color="#f5f5f5"/></>; }
export function ShoeCamera() { return null; }
export function ShoeControls() { return null; }

export default function ShoeViewer({ tone, modelUrl, poster, name = "shoe" }: { tone: Product["tone"]; modelUrl?: string; poster: React.ReactNode; name?: string }) {
  const [visible, setVisible] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(element);
    const weakDevice = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduce);
    const canvas = document.createElement("canvas");
    const webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    setCanRender(Boolean(webgl && modelUrl && (weakDevice === undefined || weakDevice >= 4) && !reduce));
    return () => observer.disconnect();
  }, [modelUrl]);
  return <div className="viewer-frame" ref={container} aria-label={`${name} product view`}>
    {canRender && visible && modelUrl ? <Canvas dpr={[0.8, 1.35]} frameloop="always" camera={{ position: [0, 0.25, 4.8], fov: 35 }} gl={{ antialias: false, powerPreference: "low-power", alpha: true }}><ShoeLighting/><Environment preset="city"/><Suspense fallback={null}><ShoeModel src={modelUrl} tone={tone}/></Suspense><ContactShadows position={[0, -0.62, 0]} opacity={0.32} scale={6} blur={2.6}/><OrbitControls enablePan={false} minDistance={3.7} maxDistance={5.6} enableDamping dampingFactor={0.08} autoRotate={!reducedMotion} autoRotateSpeed={0.35}/></Canvas> : poster}
    {modelUrl && !canRender && <span className="viewer-fallback-label">STATIC VIEW · 3D UNAVAILABLE</span>}
  </div>;
}


