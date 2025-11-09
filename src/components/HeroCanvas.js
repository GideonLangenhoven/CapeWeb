import React, { useEffect, useRef } from 'react';

const HeroCanvas = () => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let mounted = true;

    // Helper function to generate random colors
    const randomColors = (count) => {
      return new Array(count)
        .fill(0)
        .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
    };

    // Dynamically import the TubesCursor module
    // Note: threejs-components uses WebGLRenderer internally for maximum browser compatibility
    // This works on all modern browsers including Safari, iOS, and Android
    const loadTubesCursor = async () => {
      try {
        const TubesCursorModule = await import('threejs-components/build/cursors/tubes1.min.js');
        const TubesCursor = TubesCursorModule.default;

        if (!mounted) return;

        // Initialize the tubes cursor
        const app = TubesCursor(canvas, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        appRef.current = app;

        if (app && app.renderer && typeof app.renderer.setClearColor === 'function') {
          app.renderer.setClearColor('#ffffff', 1);
        }

        if (app && app.renderer && app.renderer.domElement) {
          app.renderer.domElement.style.backgroundColor = '#ffffff';
        }

        // Add click handler to randomize colors
        const handleClick = () => {
          const colors = randomColors(3);
          const lightsColors = randomColors(4);
          if (app && app.tubes) {
            app.tubes.setColors(colors);
            app.tubes.setLightsColors(lightsColors);
          }
        };

        document.body.addEventListener('click', handleClick);

        // Store cleanup function
        return () => {
          document.body.removeEventListener('click', handleClick);
          if (appRef.current && appRef.current.dispose) {
            appRef.current.dispose();
          }
        };
      } catch (error) {
        console.error('Failed to load TubesCursor:', error);
        // Fallback: Set a simple background color if WebGL fails
        if (canvas) {
          canvas.style.backgroundColor = '#ffffff';
        }
      }
    };

    const cleanupPromise = loadTubesCursor();

    return () => {
      mounted = false;
      if (cleanupPromise) {
        cleanupPromise.then(cleanup => {
          if (cleanup) cleanup();
        });
      }
    };
  }, []);

  return (
    <div className="hero-effect-canvas" aria-hidden="true">
      <canvas ref={canvasRef} id="hero-canvas" />
    </div>
  );
};

export default HeroCanvas;
