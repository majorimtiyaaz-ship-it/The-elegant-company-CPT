import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollZoomImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ScrollZoomImage: React.FC<ScrollZoomImageProps> = ({ 
  src, 
  alt, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll progress of the container as it passes through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Scale smoothly from 1.15 down to 1.05 based on viewport scroll position
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.05]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      <motion.img
        src={src}
        alt={alt}
        style={{ scale }}
        className={`w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-115 ${className}`}
      />
    </div>
  );
};
