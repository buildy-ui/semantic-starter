import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  maxWidth?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  maxWidth = width
}) => {
  const basePath = `/images/${src}`;
  const targetWidth = Math.min(maxWidth, width);
  
  {/*const imageSrc = targetWidth <= 320 ? `${basePath}-320w.webp` : 
                   targetWidth <= 768 ? `${basePath}-768w.webp` : 
                   `${basePath}-1200w.webp`;*/}
  
  return (
    <div className={`overflow-hidden rounded-t-md aspect-[3/2] ${className}`}>
      <img
        src={`${basePath}-fallback.jpg`}
        srcSet={`
          ${basePath}-320w.webp 320w,
          ${basePath}-768w.webp 768w,
          ${basePath}-1200w.webp 1200w
        `}
        sizes={`${targetWidth}px`}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </div>
  );
};
