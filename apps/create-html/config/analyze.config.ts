// Configuration for DOM analysis (renderToStaticMarkup + parse5)

export type AnalyzeDomConfig = {
  // Path to the app router entry (relative to repo root)
  routerEntryPath: string
  // Alias prefix that represents the app src root (e.g., '@/')
  aliasAtPrefix: string
  // Filesystem path for the alias root (relative to repo root), e.g., 'apps/vite/src'
  aliasAtRoot: string
  // Output directory for parsed JSON reports (relative to repo root)
  outputDir: string
  // When true, analyze with full App layout; when false, render route directly
  useLayout: boolean
}

export const analyzeDomConfig: AnalyzeDomConfig = {
  routerEntryPath: 'apps/vite/src/main.tsx',
  aliasAtPrefix: '@/',
  aliasAtRoot: 'apps/vite/src',
  outputDir: 'apps/create-html/@parse',
  useLayout: false,
}


