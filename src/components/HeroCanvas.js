import React, { useEffect, useRef } from 'react';

const ORB_COUNT = 22;
const BASE_RADIUS = 120;
const POINTER_INFLUENCE = 0.052;

const createOrb = (width, height) => ({
  x: Math.random() * width,
  y: Math.random() * height,
  radius: BASE_RADIUS + Math.random() * 140,
  hue: 150 + Math.random() * 120,
  alpha: 0.25 + Math.random() * 0.4,
  velocityX: (-0.5 + Math.random()) * 0.35,
  velocityY: (-0.5 + Math.random()) * 0.35
});

const HeroCanvas = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d', { alpha: true });
    const pointer = { x: 0, y: 0, initialized: false };
    const orbs = [];
    let width = 0;
    let height = 0;
    let devicePixelRatio = window.devicePixelRatio || 1;

    const setCanvasSize = () => {
      devicePixelRatio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      context.scale(devicePixelRatio, devicePixelRatio);
    };

    const init = () => {
      setCanvasSize();
      orbs.splice(0, orbs.length);
      for (let index = 0; index < ORB_COUNT; index += 1) {
        orbs.push(createOrb(width, height));
      }
    };

    const updatePointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.initialized = true;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      orbs.forEach((orb) => {
        const targetX = pointer.initialized ? pointer.x : width / 2;
        const targetY = pointer.initialized ? pointer.y : height / 2;

        orb.x += orb.velocityX + (targetX - orb.x) * POINTER_INFLUENCE * 0.15;
        orb.y += orb.velocityY + (targetY - orb.y) * POINTER_INFLUENCE * 0.15;

        if (orb.x < -orb.radius) orb.x = width + orb.radius;
        if (orb.x > width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = height + orb.radius;
        if (orb.y > height + orb.radius) orb.y = -orb.radius;

        const gradient = context.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );

        gradient.addColorStop(0, `hsla(${orb.hue}, 95%, 65%, ${orb.alpha})`);
        gradient.addColorStop(0.45, `hsla(${orb.hue + 20}, 90%, 55%, ${orb.alpha * 0.45})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        context.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    init();
    render();

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('resize', init);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="hero-effect-canvas" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default HeroCanvas;
