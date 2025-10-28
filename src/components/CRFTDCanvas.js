import React, { useEffect, useRef, useState } from 'react';

const CRFTDCanvas = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);

  useEffect(() => {
    let cleanupFn;

    const initThree = () => {
      if (!window.THREE) return () => {};

      setIsThreeLoaded(true);

      const mousePos = { x: 0.5, y: 0.5 };
      let phase = 0;

      // Mouse tracking
      const handleMouseMove = (event) => {
        mousePos.x = event.clientX / window.innerWidth;
        mousePos.y = event.clientY / window.innerHeight;
      };
      document.addEventListener('mousemove', handleMouseMove);

      // Three.js setup
      const scene = new window.THREE.Scene();
      const camera = new window.THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;

      const renderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);

      if (canvasRef.current) {
        canvasRef.current.appendChild(renderer.domElement);
      }

      // Geometry and material
      const boxSize = 0.2;
      const geometry = new window.THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const materialGreen = new window.THREE.MeshBasicMaterial({
        transparent: true,
        color: 0x7dfbff,
        opacity: 0.4,
        side: window.THREE.DoubleSide
      });

      const pitchSegments = 60;
      const elevationSegments = pitchSegments / 2;
      const particles = pitchSegments * elevationSegments;
      const side = Math.pow(particles, 1/3);
      const radius = 16;

      const parentContainer = new window.THREE.Object3D();
      scene.add(parentContainer);

      function posInBox(place) {
        return ((place / side) - 0.5) * radius * 1.2;
      }

      // Create particle grid
      for (let p = 0; p < pitchSegments; p++) {
        const pitch = Math.PI * 2 * p / pitchSegments;
        for (let e = 0; e < elevationSegments; e++) {
          const elevation = Math.PI * ((e / elevationSegments) - 0.5);
          const particle = new window.THREE.Mesh(geometry, materialGreen);

          parentContainer.add(particle);

          const dest = new window.THREE.Vector3();
          dest.z = (Math.sin(pitch) * Math.cos(elevation)) * radius;
          dest.x = (Math.cos(pitch) * Math.cos(elevation)) * radius;
          dest.y = Math.sin(elevation) * radius;

          particle.position.x = posInBox(parentContainer.children.length % side);
          particle.position.y = posInBox(Math.floor(parentContainer.children.length / side) % side);
          particle.position.z = posInBox(Math.floor(parentContainer.children.length / Math.pow(side, 2)) % side);

          particle.userData = {
            dests: [dest, particle.position.clone()],
            speed: new window.THREE.Vector3()
          };
        }
      }

      // Animation loop
      function render() {
        phase += 0.002;

        for (let i = 0, l = parentContainer.children.length; i < l; i++) {
          const particle = parentContainer.children[i];
          const dest = particle.userData.dests[Math.floor(phase) % particle.userData.dests.length].clone();
          const diff = dest.sub(particle.position);

          particle.userData.speed.divideScalar(1.02);
          particle.userData.speed.add(diff.divideScalar(400));
          particle.position.add(particle.userData.speed);
          particle.lookAt(dest);
        }

        parentContainer.rotation.y = phase * 3;
        parentContainer.rotation.x = (mousePos.y - 0.5) * Math.PI;
        parentContainer.rotation.z = (mousePos.x - 0.5) * Math.PI;

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(render);
      }

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Store refs
      sceneRef.current = scene;
      rendererRef.current = renderer;

      // Start animation
      render();

      // Cleanup
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (canvasRef.current && renderer.domElement && canvasRef.current.contains(renderer.domElement)) {
          canvasRef.current.removeChild(renderer.domElement);
        }
        // Clean up Three.js objects
        if (sceneRef.current) {
          while (sceneRef.current.children.length > 0) {
            const child = sceneRef.current.children[0];
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
            sceneRef.current.remove(child);
          }
        }
        if (renderer.forceContextLoss) {
          renderer.forceContextLoss();
        }
      };
    };

    if (!window.THREE) {
      // Attempt to load Three.js dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/three@0.162.0/build/three.min.js';
      script.async = true;
      script.onload = () => {
        cleanupFn = initThree();
      };
      script.onerror = () => {
        console.warn('Three.js failed to load');
      };
      document.head.appendChild(script);

      return () => {
        if (cleanupFn) cleanupFn();
        if (script && script.parentNode) script.parentNode.removeChild(script);
      };
    } else {
      cleanupFn = initThree();
      return () => {
        if (cleanupFn) cleanupFn();
      };
    }
  }, []);

  if (!isThreeLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          background: 'linear-gradient(45deg, rgba(125, 251, 255, 0.05), rgba(198, 255, 53, 0.05))',
          opacity: 0.3
        }}
      />
    );
  }

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        mixBlendMode: 'difference'
      }}
    />
  );
};

export default CRFTDCanvas;
