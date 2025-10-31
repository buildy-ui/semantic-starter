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
  <link rel="stylesheet" href="styles.legacy.css">
  <link rel="stylesheet" href="styles.css">
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
    EntryComponent = (await import(pathToFileURL(absEntryPath).href)).default
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


