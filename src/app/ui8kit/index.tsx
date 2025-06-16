import React from 'react';

// Check the constant from the environment variables
const FIXED_MODE = import.meta.env.VITE_UI8KIT_MODE as 'utility' | 'semantic' | undefined;

// Global state of the mode
let currentMode: 'utility' | 'semantic' = 'utility';
const listeners = new Set<(mode: 'utility' | 'semantic') => void>();

// Initialization of the mode from localStorage or fixed mode
const initializeMode = () => {
  if (typeof window === 'undefined') return 'utility';
  
  // If a constant is set - use it and ignore localStorage
  if (FIXED_MODE && (FIXED_MODE === 'utility' || FIXED_MODE === 'semantic')) {
    return FIXED_MODE;
  }
  
  const savedMode = localStorage.getItem('ui8kit-theme-mode') as 'utility' | 'semantic';
  return (savedMode === 'semantic' || savedMode === 'utility') ? savedMode : 'utility';
};

// Function to update the mode
export const updateUIMode = (newMode: 'utility' | 'semantic') => {
  // If a constant is set - block changes
  if (FIXED_MODE) {
    console.warn(`UI8Kit mode is fixed to "${FIXED_MODE}" and cannot be changed`);
    return;
  }
  
  currentMode = newMode;
  listeners.forEach(listener => listener(newMode));
};

// Function to get the current mode
const getMode = () => currentMode;

// Function to check if mode is fixed
export const isModeFixed = () => !!FIXED_MODE;

// Initialize the mode on load
if (typeof window !== 'undefined') {
  currentMode = initializeMode();
  
  // Listen for mode changes only if mode is not fixed
  if (!FIXED_MODE) {
    window.addEventListener('themeMode', (e: Event) => {
      const customEvent = e as CustomEvent;
      updateUIMode(customEvent.detail);
    });
  }
}

// Simple module cache
const moduleCache = new Map();

// Synchronous loading of components
function getComponent(directory: 'ui' | 'components' | 'blocks', fileName: string, componentName: string) {
  const mode = getMode();
  const cacheKey = `${mode}-${directory}-${fileName}-${componentName}`;
  
  if (moduleCache.has(cacheKey)) {
    return moduleCache.get(cacheKey);
  }
  
  // Create a component wrapper
  const Component = React.forwardRef((props: any, ref: any) => {
    const [, forceUpdate] = React.useState({});
    
    React.useEffect(() => {
      const listener = () => forceUpdate({});
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);
    
    // Dynamic import of the module
    const [ModuleComponent, setModuleComponent] = React.useState<any>(null);
    
    React.useEffect(() => {
      const currentMode = getMode();
      
      import(`./${currentMode}/${directory}/${fileName}.tsx`)
        .then((module: any) => {
          const comp = module[componentName] || module.default;
          setModuleComponent(() => comp || (() => <div>{directory}.{fileName}.{componentName} not found</div>));
        })
        .catch(() => {
          setModuleComponent(() => () => <div>{directory}.{fileName}.{componentName} not found</div>);
        });
    }, [getMode()]);
    
    if (!ModuleComponent) {
      return null; // Or a simple loader
    }
    
    return <ModuleComponent {...props} ref={ref} />;
  });
  
  Component.displayName = `${directory}.${fileName}.${componentName}`;
  moduleCache.set(cacheKey, Component);
  
  return Component;
}

// Simplified proxy
function createProxy(directory: 'ui' | 'components' | 'blocks') {
  return new Proxy({}, {
    get(_target: any, fileName: string) {
      if (typeof fileName === 'string' && fileName !== 'default' && !fileName.startsWith('_')) {
        return new Proxy({}, {
          get(_componentTarget: any, componentName: string) {
            return getComponent(directory, fileName, componentName);
          }
        });
      }
      return undefined;
    }
  });
}

// Export all categories
export const ui = createProxy('ui');
export const components = createProxy('components');
export const blocks = createProxy('blocks');

// Default export for backward compatibility
export default { ui, components, blocks };
