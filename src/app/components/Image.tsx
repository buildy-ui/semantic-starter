import React, { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  maxWidth?: number;
  aboveFold?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  maxWidth = width
}) => {
  const [isAboveFold, setIsAboveFold] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Determine if the image is above the fold
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If the image is in the first 100vh - consider it above-the-fold
      setIsAboveFold(rect.top < viewportHeight);
    }
  }, []);
  
  const basePath = `/images/${src}`;
  const aspectRatio = (height / width) * 100;
  
  const shouldLoadEager = priority || isAboveFold;
  
  const generateSmartSrcSet = () => {
    //const availableSizes = [320, 768, 1200];
    const targetWidth = Math.min(maxWidth, width);
    
    if (targetWidth <= 320) {
      return `${basePath}-320w.webp 320w`;
    }
    
    if (targetWidth <= 768) {
      return `${basePath}-320w.webp 320w, ${basePath}-768w.webp 768w`;
    }
    
    return `${basePath}-320w.webp 320w, ${basePath}-768w.webp 768w, ${basePath}-1200w.webp 1200w`;
  };
  
  const generateSmartSizes = () => {
    if (sizes) return sizes;
    
    const targetWidth = Math.min(maxWidth, width);
    
    if (targetWidth <= 320) {
      return '320px';
    }
    
    if (targetWidth <= 768) {
      return '(max-width: 320px) 320px, 768px';
    }
    
    return `(max-width: 320px) 320px, (max-width: 768px) 768px, ${targetWidth}px`;
  };
  
  return (
    <div 
      ref={imgRef}
      className={`relative ${className}`}
      style={{ 
        paddingBottom: `${aspectRatio}%`,
        height: 0 
      }}
    >
      <picture className="absolute inset-0 w-full h-full">
        <source
          srcSet={generateSmartSrcSet()}
          sizes={generateSmartSizes()}
          type="image/webp"
        />
        <img
          src={`${basePath}-fallback.jpg`}
          alt={alt}
          width={width}
          height={height}
          className="absolute inset-0 w-full h-full object-cover"
          loading={shouldLoadEager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ aspectRatio: `${width}/${height}` }}
          {...(shouldLoadEager && { fetchPriority: 'high' as any })}
        />
      </picture>
    </div>
  );
};
