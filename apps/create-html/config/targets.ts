// Configuration for static HTML generation targets
// Each target defines where to import the React root component from,
// where to write the generated HTML and CSS, and where to copy CSS from.

export type HtmlTargetConfig = {
  name: string
  // Absolute or repo-root-relative path to a TSX/TS file exporting a default React component
  entryPath: string
  // Output directory (repo-root-relative) where index.html and assets/ will be written
  outputDir: string
  // Ordered list of repo-root-relative CSS sources to try. Each item can be:
  // - a directory (we'll pick the first .css file inside)
  // - a concrete .css file path
  cssSources: string[]
  // Optional document title
  title?: string
  // Optional single route path to render (e.g. '/', 'about') from main router
  path?: string
}

export const targets: HtmlTargetConfig[] = [
  {
    name: 'vite-app',
    entryPath: 'apps/vite/src/main.tsx',
    outputDir: 'apps/create-html/html',
    cssSources: [],
    title: 'Pure HTML5 based on Tailwind CSS',
    // Set to '/' for home page or 'about' for the About route
    // path: 'about',
  },
]


