import React, { useState, useEffect } from 'react';

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
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (imgSrc.endsWith('.webp')) {
      setImgSrc(imgSrc.replace('.webp', '.jpg'));
    } else if (imgSrc.endsWith('.jpg')) {
      setImgSrc(imgSrc.replace('.jpg', '.png'));
    }
  };

  return (
    <div className="w-full h-full overflow-hidden relative bg-stone-900">
      <img
        src={imgSrc}
        alt={alt}
        loading="eager"
        decoding="async"
        onError={handleError}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none ${className}`}
      />
    </div>
  );
};
