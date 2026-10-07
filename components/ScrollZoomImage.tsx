import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollZoomImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Gentle scroll parallax inside the frame. true = 5%, or pass a percentage (keep it under 6). */
  parallax?: boolean | number;
}

export const ScrollZoomImage: React.FC<ScrollZoomImageProps> = ({ 
  src, 
  alt, 
  className = "",
  parallax = false
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // Scroll-linked drift: the photo moves a little slower than its frame.
  // The image is scaled up 12% so the frame never shows an edge.
  useEffect(() => {
    if (!parallax) return;
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const amount = typeof parallax === 'number' ? parallax : 5;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        img,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    });
    return () => mm.revert();
  }, [parallax]);

  const handleError = () => {
    if (imgSrc.endsWith('.webp')) {
      setImgSrc(imgSrc.replace('.webp', '.jpg'));
    } else if (imgSrc.endsWith('.jpg')) {
      setImgSrc(imgSrc.replace('.jpg', '.png'));
    }
  };

  return (
    <div ref={wrapRef} className="w-full h-full overflow-hidden relative bg-stone-900">
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={handleError}
        className={`w-full h-full object-cover select-none ${
          parallax
            ? 'scale-[1.12] group-hover:scale-[1.18] transition-[scale] duration-700 ease-out'
            : 'transition-transform duration-700 ease-out group-hover:scale-105'
        } ${className}`}
      />
    </div>
  );
};
