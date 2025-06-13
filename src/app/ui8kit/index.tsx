import React, { Suspense, lazy } from 'react';

const getMode = () => {
  if (typeof window === 'undefined') return 'utility';
  return new URLSearchParams(window.location.search).get('ui8kit') || 'utility';
};

// Cache for loaded modules
const moduleCache = new Map();

// Create a function to load files from different directories
function loadFile(directory: 'ui' | 'components' | 'blocks', fileName: string) {
  const mode = getMode();
  const cacheKey = `${mode}-${directory}-${fileName}`;
  
  if (!moduleCache.has(cacheKey)) {
    const modulePromise = import(`./${mode}/${directory}/${fileName}.tsx`)
      .catch(() => {
        console.warn(`${directory}/${fileName} not found in ${mode} mode`);
        return { default: () => <div>{directory}/{fileName} not found</div> };
      });
    
    moduleCache.set(cacheKey, modulePromise);
  }
  
  return moduleCache.get(cacheKey);
}

// Create proxy factory
function createProxy(directory: 'ui' | 'components' | 'blocks') {
  return new Proxy({}, {
    get(target: any, prop: string) {
      if (typeof prop === 'string' && prop !== 'default' && !prop.startsWith('_')) {
        if (!target[prop]) {
          target[prop] = new Proxy({}, {
            get(componentTarget: any, componentName: string) {
              if (!componentTarget[componentName]) {
                const LazyComponent = lazy(() => 
                  loadFile(directory, prop).then((module: any) => ({
                    default: module[componentName] || module.default || 
                      (() => <div>{directory}.{prop}.{componentName} not found</div>)
                  }))
                );
                
                componentTarget[componentName] = React.forwardRef((props: any, ref: any) => (
                  <Suspense>
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
}

// Export all categories
export const ui = createProxy('ui');
export const components = createProxy('components');
export const blocks = createProxy('blocks');

// Default export for backward compatibility
export default { ui, components, blocks };
