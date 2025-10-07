// Configuration for collecting Tailwind classes produced by @ui8kit/* packages

export type Ui8kitAnalyzeConfig = {
  // Path to the app router entry (relative to repo root)
  routerEntryPath: string
  // Alias prefix that represents the app src root (e.g., '@/')
  aliasAtPrefix: string
  // Filesystem path for the alias root (relative to repo root), e.g., 'apps/admin/src'
  aliasAtRoot: string
  // Output directory for JSON sets (relative to repo root)
  outputDir: string
  // When true, analyze with full App layout; when false, render route directly
  useLayout: boolean
  // Namespaces to track (e.g., ['core','form','chat']) or 'auto' to infer from imports
  trackNamespaces: string[] | 'auto'
}

export const ui8kitAnalyzeConfig: Ui8kitAnalyzeConfig = {
  routerEntryPath: 'apps/admin/src/main.tsx',
  aliasAtPrefix: '@/',
  aliasAtRoot: 'apps/admin/src',
  outputDir: 'apps/admin/src/assets/json/.ui8kit',
  useLayout: true,
  trackNamespaces: 'auto',
}


