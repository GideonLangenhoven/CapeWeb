import React, { useEffect, useRef } from 'react';
import './ParticleSliderLogo.css';

const ParticleSliderLogo = ({ width = 200, height = 60, className = '' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const psRef = useRef(null);

  useEffect(() => {
    // ParticleSlider implementation adapted for capeweb logo
    class ParticleSlider {
      constructor(options = {}) {
        this.canvas = canvasRef.current;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.ptlGap = options.ptlGap || 1;
        this.ptlSize = options.ptlSize || 1;
        this.color = options.color || '#7dfbff';
        this.restless = options.restless || true;
        this.monochrome = true;

        this.particles = [];
        this.textPixels = [];

        this.init();
        this.animate();
      }

      init() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        // Create text pixels for "capeweb"
        this.createTextPixels();
        this.createParticles();
      }

      createTextPixels() {
        // Create temporary canvas to get text pixel data
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.width;
        tempCanvas.height = this.height;

        // Style the text - scale font size based on component size
        const fontSize = Math.max(Math.floor(this.width / 10), 12);
        tempCtx.fillStyle = '#ffffff';
        tempCtx.font = `bold ${fontSize}px Space Grotesk, sans-serif`;
        tempCtx.textAlign = 'center';
        tempCtx.textBaseline = 'middle';

        // Draw "capeweb" text
        tempCtx.fillText('capeweb', this.width / 2, this.height / 2);

        // Get pixel data
        const imageData = tempCtx.getImageData(0, 0, this.width, this.height);
        const pixels = imageData.data;

        this.textPixels = [];

        // Extract non-transparent pixels
        for (let y = 0; y < this.height; y += this.ptlGap + 1) {
          for (let x = 0; x < this.width; x += this.ptlGap + 1) {
            const index = (y * this.width + x) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 128) { // If pixel is not transparent
              this.textPixels.push({ x, y });
            }
          }
        }
      }

      createParticles() {
        this.particles = [];

        for (let i = 0; i < this.textPixels.length; i++) {
          const pixel = this.textPixels[i];
          this.particles.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            targetX: pixel.x,
            targetY: pixel.y,
            vx: 0,
            vy: 0,
            size: this.ptlSize
          });
        }
      }

      animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw particles
        for (let particle of this.particles) {
          // Move toward target position with optimized physics
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;

          particle.vx += dx * 0.03;
          particle.vy += dy * 0.03;

          // Add some friction
          particle.vx *= 0.92;
          particle.vy *= 0.92;

          particle.x += particle.vx;
          particle.y += particle.vy;

          // Add restless movement
          if (this.restless) {
            particle.x += (Math.random() - 0.5) * 0.5;
            particle.y += (Math.random() - 0.5) * 0.5;
          }

          // Draw particle with subtle glow
          this.ctx.shadowColor = this.color;
          this.ctx.shadowBlur = 3;
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
          this.ctx.shadowBlur = 0;
        }

        requestAnimationFrame(() => this.animate());
      }

      setColor(color) {
        this.color = color;
      }
    }

    if (canvasRef.current) {
      psRef.current = new ParticleSlider({
        ptlGap: 1,
        ptlSize: 1,
        color: '#7dfbff'
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, [width, height]);

  const handleClick = () => {
    if (psRef.current) {
      psRef.current.init();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`particle-slider-logo ${className}`}
      onClick={handleClick}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="particle-canvas"
      />
    </div>
  );
};

export default ParticleSliderLogo;