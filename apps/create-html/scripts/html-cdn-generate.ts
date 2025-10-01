// @ts-nocheck
// bun scripts/html-generate.ts
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync, existsSync, cpSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'
import pretty from 'pretty'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, skyOSTheme } from '@ui8kit/core'

type GenerateOptions = {
  entryPath: string
  outputDir: string
  cssSources: string[]
  title?: string
  // Optional route path from the app router to render a single page
  // Examples: '/', 'about', 'blog'
  path?: string
}

function createHTMLDocument(content: string, title = 'App') {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
:root {
  --background: hsl(0 0% 97.2549%);
  --foreground: hsl(240 3.3333% 11.7647%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 3.3333% 11.7647%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 3.3333% 11.7647%);
  --primary: hsl(187.4739 173.4032% 31.3580%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(0 0% 94.1176%);
  --secondary-foreground: hsl(0 0% 29.0196%);
  --muted: hsl(0 0% 94.1176%);
  --secondary-foreground: hsl(240 2.2222% 44.1176%);
  --accent: hsl(203.9916 96.5418% 93.6698%);
  --accent-foreground: hsl(196.6949 85.4389% 14.5510%);
  --destructive: hsl(358.7594 101.8439% 69.8357%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 87.8431%);
  --input: hsl(0 0% 100%);
  --ring: hsl(187.4739 173.4032% 31.3580%);
  --chart-1: hsl(187.4739 173.4032% 31.3580%);
  --chart-2: hsl(164.7862 160.6702% 31.9404%);
  --chart-3: hsl(46.8179 100.7390% 59.5298%);
  --chart-4: hsl(358.7594 101.8439% 69.8357%);
  --chart-5: hsl(270.7222 110.5994% 75.2991%);
  --sidebar: hsl(0 0% 100%);
  --sidebar-foreground: hsl(0 0% 29.0196%);
  --sidebar-primary: hsl(187.4739 173.4032% 31.3580%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(186.1272 175.0225% 34.5777%);
  --sidebar-accent-foreground: hsl(0 0% 100%);
  --sidebar-border: hsl(0 0% 87.8431%);
  --sidebar-ring: hsl(187.4739 173.4032% 31.3580%);
  --font-sans: Outfit, sans-serif;
  --font-serif: Roboto, sans-serif;
  --font-mono: Fira Code, monospace;
  --radius: 0.625rem;
  --shadow-2xs: 0 0 25px 5px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0 0 25px 5px hsl(0 0% 0% / 0.01);
  --shadow-sm: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 1px 2px 4px hsl(0 0% 0% / 0.01);
  --shadow: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 1px 2px 4px hsl(0 0% 0% / 0.01);
  --shadow-md: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 2px 4px 4px hsl(0 0% 0% / 0.01);
  --shadow-lg: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 4px 6px 4px hsl(0 0% 0% / 0.01);
  --shadow-xl: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 8px 10px 4px hsl(0 0% 0% / 0.01);
  --shadow-2xl: 0 0 25px 5px hsl(0 0% 0% / 0.03);
  --tracking-normal: normal;
  --spacing: 0.25rem;
}

.dark {
  --background: hsl(0 0% 7.0588%);
  --foreground: hsl(0 0% 87.8431%);
  --card: hsl(0 0% 11.7647%);
  --card-foreground: hsl(0 0% 87.8431%);
  --popover: hsl(0 0% 11.7647%);
  --popover-foreground: hsl(0 0% 87.8431%);
  --primary: hsl(189.9661 161.8632% 27.5935%);
  --primary-foreground: hsl(183.1588 99.9180% 96.2486%);
  --secondary: hsl(0 0% 16.4706%);
  --secondary-foreground: hsl(0 0% 80%);
  --muted: hsl(0 0% 16.4706%);
  --secondary-foreground: hsl(0 0% 62.7451%);
  --accent: hsl(196.6949 85.4389% 14.5510%);
  --accent-foreground: hsl(186.1272 175.0225% 34.5777%);
  --destructive: hsl(358.7594 101.8439% 69.8357%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(0 0% 20%);
  --input: hsl(0 0% 11.7647%);
  --ring: hsl(189.9661 161.8632% 27.5935%);
  --chart-1: hsl(189.9661 161.8632% 27.5935%);
  --chart-2: hsl(164.7862 160.6702% 31.9404%);
  --chart-3: hsl(46.6817 159.6637% 38.5235%);
  --chart-4: hsl(358.7594 101.8439% 69.8357%);
  --chart-5: hsl(256.1554 109.0025% 76.8871%);
  --sidebar: hsl(0 0% 11.7647%);
  --sidebar-foreground: hsl(0 0% 80%);
  --sidebar-primary: hsl(189.9661 161.8632% 27.5935%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(187.4739 173.4032% 31.3580%);
  --sidebar-accent-foreground: hsl(0 0% 100%);
  --sidebar-border: hsl(0 0% 20%);
  --sidebar-ring: hsl(189.9661 161.8632% 27.5935%);
  --font-sans: Outfit, sans-serif;
  --font-serif: Roboto, sans-serif;
  --font-mono: Fira Code, monospace;
  --radius: 0.625rem;
  --shadow-2xs: 0 0 25px 5px hsl(0 0% 0% / 0.01);
  --shadow-xs: 0 0 25px 5px hsl(0 0% 0% / 0.01);
  --shadow-sm: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 1px 2px 4px hsl(0 0% 0% / 0.01);
  --shadow: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 1px 2px 4px hsl(0 0% 0% / 0.01);
  --shadow-md: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 2px 4px 4px hsl(0 0% 0% / 0.01);
  --shadow-lg: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 4px 6px 4px hsl(0 0% 0% / 0.01);
  --shadow-xl: 0 0 25px 5px hsl(0 0% 0% / 0.01), 0 8px 10px 4px hsl(0 0% 0% / 0.01);
  --shadow-2xl: 0 0 25px 5px hsl(0 0% 0% / 0.03);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}

body {
  letter-spacing: var(--tracking-normal);
  button {
    cursor: pointer;
  }
}
      </style>
  <script>
    (function() {
      try {
        var stored = localStorage.getItem('darkmode');
        var prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = stored === 'dark' || (stored === null && prefers);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}

      document.addEventListener('DOMContentLoaded', function () {
        var btn = document.querySelector('button[aria-label="Toggle dark mode"]');
        if (!btn) return;
        btn.addEventListener('click', function () {
          var nowDark = document.documentElement.classList.toggle('dark');
          try { localStorage.setItem('darkmode', nowDark ? 'dark' : 'light'); } catch (e) {}
        });
      });
    })();
  </script>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGJiYTciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib3gtaWNvbiBsdWNpZGUtYm94Ij48cGF0aCBkPSJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaIi8+PHBhdGggZD0ibTMuMyA3IDguNyA1IDguNy01Ii8+PHBhdGggZD0iTTEyIDIyVjEyIi8+PC9zdmc+" />
</head>
<body class="bg-background text-foreground">
  ${content}
</body>
</html>`

  return pretty(html, { ocd: true })
}

function copyCssToAssets(targetRoot: string, cssPaths: string[]) {
  const assetsCssDir = join(targetRoot, 'assets', 'css')
  if (!existsSync(assetsCssDir)) {
    mkdirSync(assetsCssDir, { recursive: true })
  }

  for (const relPath of cssPaths) {
    const absPath = join(process.cwd(), relPath)
    if (!existsSync(absPath)) continue

    try {
      // If path is a directory, pick first .css file inside
      const listing = readdirSync(absPath)
      const cssFile = listing.find((f: string) => f.endsWith('.css'))
      if (cssFile) {
        const sourceCssPath = join(absPath, cssFile)
        const targetCssPath = join(assetsCssDir, 'styles.css')
        cpSync(sourceCssPath, targetCssPath)
        console.log(`✅ Copied: ${sourceCssPath} -> ${targetCssPath}`)
        return
      }
    } catch (_) {
      // Not a directory, try as file
      if (absPath.endsWith('.css')) {
        const targetCssPath = join(assetsCssDir, 'styles.css')
        cpSync(absPath, targetCssPath)
        console.log(`✅ Copied: ${absPath} -> ${targetCssPath}`)
        return
      }
    }
  }

  console.warn('⚠️  No CSS source found in provided cssSources')
}

export async function generateHtml(options: GenerateOptions) {
  const { entryPath, outputDir, cssSources, title, path } = options
  console.log(`📄 Rendering ${entryPath} to static HTML...`)

  const absEntryPath = join(process.cwd(), entryPath)

  // If a route path is provided, resolve the matching component from the router file
  let EntryComponent: any
  let AppComponent: any | undefined
  if (path) {
    EntryComponent = await resolveRouteComponentFromEntry(absEntryPath, path)
    AppComponent = await resolveRootAppComponentFromEntry(absEntryPath)
  } else {
    // No specific path provided: generate the entire site from the router
    await generateAllRoutes(absEntryPath, outputDir, title)
    if (cssSources && cssSources.length > 0) {
      console.log('📁 Copying CSS...')
      copyCssToAssets(outputDir, cssSources)
    } else {
      console.log('ℹ️  Skipping CSS copy (no cssSources configured)')
    }
    return
  }

  if (!EntryComponent) {
    throw new Error(`Unable to resolve component to render for ${path ?? 'default export'} in ${entryPath}`)
  }

  const appElement = path && AppComponent
    ? React.createElement(
        ThemeProvider,
        { theme: skyOSTheme },
        createRouterElementForPath(AppComponent, EntryComponent, normalizeRoutePath(path))
      )
    : React.createElement(
        ThemeProvider,
        { theme: skyOSTheme },
        React.createElement(EntryComponent)
      )

  const content = renderToStaticMarkup(appElement)

  const normalizedPath = normalizeRoutePath(path)
  const fullPath = normalizedPath === '/'
    ? join(outputDir, 'index.html')
    : join(outputDir, normalizedPath.replace(/^\//, ''), 'index.html')
  const dirPath = dirname(fullPath)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  writeFileSync(fullPath, createHTMLDocument(content, title))
  console.log(`✅ Generated: ${fullPath}`)

  if (cssSources && cssSources.length > 0) {
    console.log('📁 Copying CSS...')
    copyCssToAssets(outputDir, cssSources)
  } else {
    console.log('ℹ️  Skipping CSS copy (no cssSources configured)')
  }
}

// --- Helpers ---

function normalizeRoutePath(routePath?: string) {
  if (!routePath || routePath === '/') return '/'
  // accept both 'about' and '/about'
  return routePath.startsWith('/') ? routePath : `/${routePath}`
}

async function resolveRouteComponentFromEntry(absEntryPath: string, routePath: string) {
  const entryDir = dirname(absEntryPath)
  const fileContent = readFileSync(absEntryPath, 'utf8')

  const importsMap = parseDefaultImports(fileContent)
  const routeToComponent = parseChildrenRoutes(fileContent)

  const normalized = normalizeRoutePath(routePath)
  const componentName = routeToComponent.get(normalized)
  if (!componentName) {
    throw new Error(`Route path not found in router: ${normalized}`)
  }

  const importSpecifier = importsMap.get(componentName)
  if (!importSpecifier) {
    throw new Error(`Import for component ${componentName} not found in entry file`)
  }

  const absModulePath = resolveImportPath(entryDir, importSpecifier)
  const moduleUrl = pathToFileURL(absModulePath).href
  const mod = await import(moduleUrl)
  return mod.default
}

function parseDefaultImports(source: string): Map<string, string> {
  const map = new Map<string, string>()
  const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'\"]+)['"];?/g
  let match: RegExpExecArray | null
  while ((match = importRegex.exec(source)) !== null) {
    const name = match[1]
    const spec = match[2]
    map.set(name, spec)
  }
  return map
}

function parseChildrenRoutes(source: string): Map<string, string> {
  const map = new Map<string, string>()
  // Capture entries inside children: [ ... ] blocks
  const childrenBlockRegex = /children:\s*\[([\s\S]*?)\]/m
  const blockMatch = childrenBlockRegex.exec(source)
  if (!blockMatch) return map
  const block = blockMatch[1]

  // Match either { index: true, element: <Home /> } OR { path: 'about', element: <About /> }
  const routeEntryRegex = /\{\s*(index:\s*true|path:\s*['"]([^'"]+)['"])\s*,\s*element:\s*<\s*([A-Za-z0-9_]+)\s*\/>/g
  let m: RegExpExecArray | null
  while ((m = routeEntryRegex.exec(block)) !== null) {
    const isIndex = m[1] && m[1].includes('index')
    const pathVal = isIndex ? '/' : `/${m[2]}`
    const componentName = m[3]
    map.set(pathVal, componentName)
  }
  return map
}

function resolveImportPath(entryDir: string, specifier: string): string {
  let base: string
  if (specifier.startsWith('@/')) {
    // '@' alias points to the src dir of the app, assume relative to entry file dir
    base = join(entryDir, specifier.slice(2))
  } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
    base = join(entryDir, specifier)
  } else {
    // Not a file import we can resolve (library). Fail early.
    throw new Error(`Unsupported import specifier for route component: ${specifier}`)
  }

  const candidates = [
    `${base}.tsx`,
    `${base}.ts`,
    `${base}.jsx`,
    `${base}.js`,
    join(base, 'index.tsx'),
    join(base, 'index.ts'),
    join(base, 'index.jsx'),
    join(base, 'index.js'),
  ]
  const found = candidates.find((p) => existsSync(p))
  if (!found) {
    throw new Error(`Unable to resolve file for import ${specifier}. Tried: ${candidates.join(', ')}`)
  }
  return found
}

async function resolveRootAppComponentFromEntry(absEntryPath: string) {
  const entryDir = dirname(absEntryPath)
  const fileContent = readFileSync(absEntryPath, 'utf8')
  const importsMap = parseDefaultImports(fileContent)
  const appName = parseRootElementName(fileContent)
  if (!appName) {
    throw new Error('Root route element not found in router (expected element: <App />)')
  }
  const importSpecifier = importsMap.get(appName)
  if (!importSpecifier) {
    throw new Error(`Import for root element ${appName} not found in entry file`)
  }
  const absModulePath = resolveImportPath(entryDir, importSpecifier)
  const moduleUrl = pathToFileURL(absModulePath).href
  const mod = await import(moduleUrl)
  return mod.default
}

function parseRootElementName(source: string): string | null {
  // Heuristic: find first element: <X /> before children: [ inside createBrowserRouter([...])
  const regex = /createBrowserRouter\(\[\s*\{[\s\S]*?element:\s*<\s*([A-Za-z0-9_]+)\s*\/>[\s\S]*?children\s*:\s*\[/m
  const m = regex.exec(source)
  return m ? m[1] : null
}

function createRouterElementForPath(AppComponent: any, RouteComponent: any, normalizedPath: string) {
  const childRoute = normalizedPath === '/'
    ? { index: true, element: React.createElement(RouteComponent) }
    : { path: normalizedPath.replace(/^\//, ''), element: React.createElement(RouteComponent) }

  const router = createMemoryRouter([
    {
      path: '/',
      element: React.createElement(AppComponent),
      children: [childRoute],
    },
  ], {
    initialEntries: [normalizedPath],
  })

  return React.createElement(RouterProvider, { router })
}


async function generateAllRoutes(absEntryPath: string, outputDir: string, title?: string) {
  const entryDir = dirname(absEntryPath)
  const fileContent = readFileSync(absEntryPath, 'utf8')
  const importsMap = parseDefaultImports(fileContent)
  const routeToComponent = parseChildrenRoutes(fileContent)
  const AppComponent = await resolveRootAppComponentFromEntry(absEntryPath)

  // Data for dynamic routes
  const dataModulePath = join(process.cwd(), 'apps/vite/src/data/index.ts')
  const dataModule = await import(pathToFileURL(dataModulePath).href)
  const renderContext = dataModule.renderContext

  for (const [routePath, componentName] of routeToComponent.entries()) {
    // Skip wildcard catch-all
    if (componentName === 'NotFound' || routePath.includes('*')) continue

    const importSpecifier = importsMap.get(componentName)
    if (!importSpecifier) {
      console.warn(`⚠️  Skipping route ${routePath}: no import for ${componentName}`)
      continue
    }

    const absModulePath = resolveImportPath(entryDir, importSpecifier)
    const moduleUrl = pathToFileURL(absModulePath).href
    const mod = await import(moduleUrl)
    const RouteComponent = mod.default
    if (!RouteComponent) {
      console.warn(`⚠️  Skipping route ${routePath}: default export missing in ${absModulePath}`)
      continue
    }

    if (routePath.includes('/:')) {
      const slugs = getDynamicSlugsForRoute(routePath, renderContext)
      for (const slug of slugs) {
        const concretePath = routePath.replace('/:slug', `/${slug}`)
        await renderRouteToFile(normalizeRoutePath(concretePath), AppComponent, RouteComponent, outputDir, title)
      }
    } else {
      await renderRouteToFile(normalizeRoutePath(routePath), AppComponent, RouteComponent, outputDir, title)
    }
  }
}

function getDynamicSlugsForRoute(routePath: string, renderContext: any): string[] {
  if (routePath.includes('/posts/:slug')) {
    return (renderContext.posts?.posts || []).map((p: any) => p.slug)
  }
  if (routePath.includes('/category/:slug')) {
    return (renderContext.categories || []).map((c: any) => c.slug)
  }
  if (routePath.includes('/tag/:slug')) {
    return (renderContext.tags || []).map((t: any) => t.slug)
  }
  if (routePath.includes('/author/:slug')) {
    return (renderContext.authors || []).map((a: any) => a.slug)
  }
  return []
}

async function renderRouteToFile(normalizedPath: string, AppComponent: any, RouteComponent: any, outputDir: string, title?: string) {
  const element = React.createElement(
    ThemeProvider,
    { theme: skyOSTheme },
    createRouterElementForPath(AppComponent, RouteComponent, normalizedPath)
  )
  const content = renderToStaticMarkup(element)
  const fullPath = normalizedPath === '/'
    ? join(outputDir, 'index.html')
    : join(outputDir, normalizedPath.replace(/^\//, ''), 'index.html')
  const dirPath = dirname(fullPath)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }
  writeFileSync(fullPath, createHTMLDocument(content, title))
  console.log(`✅ Generated: ${fullPath}`)
}


