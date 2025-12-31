'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [rotation, setRotation] = useState(0);

  // Smooth springs for the "fluid" follow effect
  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      const deltaX = x - lastX;
      const deltaY = y - lastY;
      
      // Minimum Threshold to prevent erratic rotation on tiny movements
      const threshold = 2;
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        // Calculate angle and apply a smooth transition
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        // We add 90 because our SVG points up by default
        setRotation(angle + 90);
      }

      mouseX.set(x);
      mouseY.set(y);
      lastX = x;
      lastY = y;
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{ rotate: rotation }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A symmetrical "Stealth" arrowhead that looks great when rotating */}
          <path 
            d="M12 2L20 22L12 18L4 22L12 2Z" 
            fill="white" 
            stroke="black" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
