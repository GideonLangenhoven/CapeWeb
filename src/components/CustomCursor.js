import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const followerRef = useRef(null);
  const [sectionColor, setSectionColor] = useState('rgba(31, 92, 240, 0.8)');

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    const mouseX = (event) => event.clientX;
    const mouseY = (event) => event.clientY;

    const positionElement = (event) => {
      const mouse = {
        x: mouseX(event),
        y: mouseY(event)
      };
      follower.style.top = mouse.y + 'px';
      follower.style.left = mouse.x + 'px';
    };

    const handleMouseMove = (event) => {
      positionElement(event);
    };

    // Section detection for color changes
    const detectSection = (event) => {
      const element = document.elementFromPoint(event.clientX, event.clientY);
      if (!element) return;

      const section = element.closest('section') || element.closest('[data-cursor-section]');
      if (section) {
        const sectionId = section.id || section.getAttribute('data-cursor-section');

        switch (sectionId) {
          case 'rds':
          case 'hero':
            setSectionColor('rgba(125, 251, 255, 0.8)'); // Cyan for hero
            break;
          case 'introduction':
          case 'module-introduction':
            setSectionColor('rgba(34, 197, 94, 0.8)'); // Green for intro
            break;
          case 'work':
          case 'services':
            setSectionColor('rgba(168, 85, 247, 0.8)'); // Purple for work/services
            break;
          case 'contact':
            setSectionColor('rgba(249, 115, 22, 0.8)'); // Orange for contact
            break;
          default:
            setSectionColor('rgba(31, 92, 240, 0.6)'); // Default accent
        }
      }
    };

    const combinedMouseMove = (event) => {
      handleMouseMove(event);
      detectSection(event);
    };

    window.addEventListener('mousemove', combinedMouseMove);

    return () => {
      window.removeEventListener('mousemove', combinedMouseMove);
    };
  }, []);

  return (
    <div id="follower" ref={followerRef} className="custom-cursor">
      <div
        id="circle1"
        className="cursor-circle cursor-circle-1"
      />
      <div
        id="circle2"
        className="cursor-circle cursor-circle-2"
        style={{ background: sectionColor }}
      />
    </div>
  );
};

export default CustomCursor;
