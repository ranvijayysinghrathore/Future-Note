'use client';

import React, { useEffect, useRef } from 'react';
import { Gradient } from '@/lib/stripe-gradient';

interface MeshGradientProps {
  isFullPage?: boolean;
}

const MeshGradient = ({ isFullPage = false }: MeshGradientProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientInstance = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && !gradientInstance.current) {
      gradientInstance.current = new Gradient();
      gradientInstance.current.initGradient('#gradient-canvas');
    }
  }, []);

  return (
    <div 
      className={`absolute inset-x-0 -z-10 overflow-hidden pointer-events-none !p-0 ${
        isFullPage ? 'top-0 min-h-screen' : 'top-[-4px] h-[65vh] md:h-[85vh]'
      }`}
      style={{
        clipPath: isFullPage ? 'none' : 'polygon(0 0, 100% 0, 100% 60%, 0 80%)'
      }}
    >
      <div className={`absolute inset-0 !p-0 ${isFullPage ? '' : 'top-[-4px] left-[-4px] right-[-4px]'}`}>
        <canvas 
          id="gradient-canvas" 
          ref={canvasRef}
          data-js-darken-top
          className="block w-full h-full opacity-90 !p-0"
          style={{
            "--gradient-color-1": "#7a73ff",
            "--gradient-color-2": "#00d1ff",
            "--gradient-color-3": "#ff5858",
            "--gradient-color-4": "#ffb800",
          } as React.CSSProperties}
        />
      </div>

      {/* Surface Overlay to soften everything */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

      {/* Subtle Grain Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default MeshGradient;

