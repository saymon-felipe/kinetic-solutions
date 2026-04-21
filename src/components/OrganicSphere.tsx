import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function OrganicSphere() {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    mouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8); 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const wireGeometry = new THREE.IcosahedronGeometry(2.55, 12);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xC3D4E2,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const wireSphere = new THREE.LineSegments(
      new THREE.EdgesGeometry(wireGeometry),
      wireMaterial
    );
    scene.add(wireSphere);
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth) * 2 - 1);
      mouseY.set(-(event.clientY / window.innerHeight) * 2 + 1);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let lastTime = 0;
    const animate = (time: number) => {
      lastTime = time;
      
      uniforms.time.value = time * 0.0005; 
      uniforms.mouse.value.set(springX.get(), springY.get()); 
      
      scene.rotation.y += 0.001;
      scene.rotation.x = springY.get() * 0.1; 

      wireSphere.position.x += (springX.get() * 0.5 - wireSphere.position.x) * 0.02;
      wireSphere.position.y += (springY.get() * 0.5 - wireSphere.position.y) * 0.02;

      wireSphere.rotation.x += 0.0015;
      wireSphere.rotation.z += 0.0008;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, [uniforms, springX, springY]);

  return (
    <motion.div 
      ref={mountRef} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, 
        pointerEvents: 'none' 
      }} 
    />
  );
}