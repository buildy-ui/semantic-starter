// ui8kit/get-components.tsx
import React, { Suspense, lazy } from 'react';

const getMode = () => {
  if (typeof window === 'undefined') return 'utility';
  return new URLSearchParams(window.location.search).get('ui8kit') || 'utility';
};

// Cache for loaded modules
const moduleCache = new Map();

// Create a function to load the component file
function loadComponentFile(fileName: string) {
  const mode = getMode();
  const cacheKey = `${mode}-${fileName}`;
  
  if (!moduleCache.has(cacheKey)) {
    const modulePromise = import(`./${mode}/components/${fileName}.tsx`)
      .catch(() => {
        console.warn(`Component file ${fileName} not found in ${mode} mode`);
        return { default: () => <div>Component file {fileName} not found</div> };
      });
    
    moduleCache.set(cacheKey, modulePromise);
  }
  
  return moduleCache.get(cacheKey);
}

// Create a proxy for automatically creating components
export default new Proxy({}, {
  get(target: any, prop: string) {
    if (typeof prop === 'string' && prop !== 'default' && !prop.startsWith('_')) {
      if (!target[prop]) {
        // Create a proxy that will return components from the loaded module
        target[prop] = new Proxy({}, {
          get(componentTarget: any, componentName: string) {
            if (!componentTarget[componentName]) {
              // Create a lazy component for each export
              const LazyComponent = lazy(() => 
                loadComponentFile(prop).then((module: any) => ({
                  default: module[componentName] || module.default || (() => <div>Component {prop}.{componentName} not found</div>)
                }))
              );
              
              componentTarget[componentName] = React.forwardRef((props: any, ref: any) => (
                <Suspense fallback={<div>Loading {prop}.{componentName}...</div>}>
                  <LazyComponent {...props} ref={ref} />
                </Suspense>
              ));
            }
            return componentTarget[componentName];
          }
        });
      }
      return target[prop];
    }
    return target[prop];
  }
});