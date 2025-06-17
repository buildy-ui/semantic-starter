import React from 'react';

/**
 * UI8Kit Component Loader
 * 
 * This system dynamically loads UI components from different registries:
 * - utility: Base components with utility classes (Tailwind)
 * - semantic: Components with semantic HTML structure
 * 
 * Usage: import { ui, components, blocks } from '@ui8kit'
 * Example: <ui.button.Button>Click me</ui.button.Button>
 */

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Fixed mode from environment variables
 * Set VITE_UI8KIT_MODE=semantic or VITE_UI8KIT_MODE=utility to lock the mode
 */
const FIXED_MODE = import.meta.env.VITE_UI8KIT_MODE as 'utility' | 'semantic' | undefined;

/**
 * Global state management
 * currentMode: Current active mode ('utility' or 'semantic')
 * listeners: Functions that get called when mode changes
 */
let currentMode: 'utility' | 'semantic' = 'utility';
const listeners = new Set<(mode: 'utility' | 'semantic') => void>();

// ==========================================
// MODE INITIALIZATION
// ==========================================

/**
 * Initialize the UI mode from environment or localStorage
 * Priority: FIXED_MODE > localStorage > 'utility' (default)
 */
const initializeMode = (): 'utility' | 'semantic' => {
  // Server-side rendering fallback
  if (typeof window === 'undefined') return 'utility';
  
  // Environment variable has highest priority
  if (FIXED_MODE && (FIXED_MODE === 'utility' || FIXED_MODE === 'semantic')) {
    return FIXED_MODE;
  }
  
  // Check user's saved preference
  const savedMode = localStorage.getItem('ui8kit-theme-mode') as 'utility' | 'semantic';
  return (savedMode === 'semantic' || savedMode === 'utility') ? savedMode : 'utility';
};

// ==========================================
// MODE MANAGEMENT
// ==========================================

/**
 * Update the current UI mode
 * @param newMode - The new mode to switch to
 */
export const updateUIMode = (newMode: 'utility' | 'semantic'): void => {
  // Prevent changes if mode is fixed via environment
  if (FIXED_MODE) {
    console.warn(`UI8Kit mode is fixed to "${FIXED_MODE}" and cannot be changed`);
    return;
  }
  
  currentMode = newMode;
  // Notify all components about the mode change
  listeners.forEach(listener => listener(newMode));
};

/**
 * Get the current active mode
 */
const getMode = (): 'utility' | 'semantic' => currentMode;

/**
 * Check if the mode is fixed via environment variable
 */
export const isModeFixed = (): boolean => !!FIXED_MODE;

// ==========================================
// BROWSER INITIALIZATION
// ==========================================

if (typeof window !== 'undefined') {
  // Set initial mode
  currentMode = initializeMode();
  
  // Listen for mode changes (only if not fixed)
  if (!FIXED_MODE) {
    window.addEventListener('themeMode', (e: Event) => {
      const customEvent = e as CustomEvent;
      updateUIMode(customEvent.detail);
    });
  }
}

// ==========================================
// COMPONENT LOADING SYSTEM
// ==========================================

/**
 * Cache for loaded components to improve performance
 * Key format: "mode-directory-fileName-componentName"
 */
const componentCache = new Map<string, React.ComponentType<any>>();

/**
 * Create a dynamic component that loads from the current mode directory
 * 
 * @param directory - Registry type ('ui', 'components', 'blocks')
 * @param fileName - File name without extension
 * @param componentName - Named export from the file
 * @returns React component that dynamically loads based on current mode
 */
function createDynamicComponent(
  directory: 'ui' | 'components' | 'blocks', 
  fileName: string, 
  componentName: string
): React.ComponentType<any> {
  
  const mode = getMode();
  const cacheKey = `${mode}-${directory}-${fileName}-${componentName}`;
  
  // Return cached component if available
  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!;
  }
  
  // Create new dynamic component
  const DynamicComponent = React.forwardRef<any, any>((props, ref) => {
    const [LoadedComponent, setLoadedComponent] = React.useState<React.ComponentType<any> | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
      const currentMode = getMode();
      
      import(`./${currentMode}/${directory}/${fileName}.tsx`)
        .then((module: any) => {
          const component = module[componentName] || module.default;
          setLoadedComponent(() => component);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }, [getMode()]);
    
    // Show skeleton while loading
    if (isLoading || !LoadedComponent) {
      return <ComponentSkeleton {...props} ref={ref} />;
    }
    
    // Show loaded component with blur-to-focus and scale animation
    return (
        <LoadedComponent 
        className="animate-blur-in"
        style={{
          animation: 'blurToFocus 0.2s ease-out forwards'
        }} {...props} ref={ref} />
    );
  });
  
  // Set display name for debugging
  DynamicComponent.displayName = `UI8Kit.${directory}.${fileName}.${componentName}`;
  
  // Cache the component
  componentCache.set(cacheKey, DynamicComponent);
  
  return DynamicComponent;
}

/**
 * Skeleton component with proper dimensions and dark mode support
 * @param className - Additional CSS classes
 * @param children - Child elements (rendered invisibly to maintain layout)
 * @param props - Additional props
 */
function ComponentSkeleton({ className, children, ...props }: any) {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md transition-all duration-75 ${className}`}
      style={{ minHeight: '2rem' }}
      {...props}
    >
      {children && <div className="invisible">{children}</div>}
    </div>
  );
}

// ==========================================
// PROXY API CREATION
// ==========================================

/**
 * Create a proxy-based API for a component registry
 * 
 * @param directory - Registry type ('ui', 'components', 'blocks')
 * @returns Proxy object that creates components on-demand
 * 
 * Example usage:
 * const registry = createComponentRegistry('ui');
 * const Button = registry.button.Button; // Creates ui/button.tsx -> Button component
 */
function createComponentRegistry(directory: 'ui' | 'components' | 'blocks') {
  return new Proxy({}, {
    get(_target: any, fileName: string) {
      // Skip special properties
      if (typeof fileName !== 'string' || fileName === 'default' || fileName.startsWith('_')) {
        return undefined;
      }
      
      // Return another proxy for component names
      return new Proxy({}, {
        get(_componentTarget: any, componentName: string) {
          return createDynamicComponent(directory, fileName, componentName);
        }
      });
    }
  });
}

// ==========================================
// PUBLIC API
// ==========================================

/**
 * UI Registry - Base utility components
 * Usage: ui.button.Button, ui.card.Card, etc.
 */
export const ui = createComponentRegistry('ui');

/**
 * Components Registry - Semantic components
 * Usage: components.section.Section, components.article.Article, etc.
 */
export const components = createComponentRegistry('components');

/**
 * Blocks Registry - Complex component blocks
 * Usage: blocks.hero.Hero, blocks.footer.Footer, etc.
 */
export const blocks = createComponentRegistry('blocks');

/**
 * Default export for backward compatibility
 */
export default { ui, components, blocks };
