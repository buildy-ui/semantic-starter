import React, { Suspense } from 'react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-200 h-8 w-full rounded" />
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};
