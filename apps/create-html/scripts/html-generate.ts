// @ts-nocheck
// bun apps/create-html
// npx serve apps/create-html/html -p 8080
// npx serve -p 8080 -c serve.json apps/create-html/html
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync, existsSync, cpSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'
import pretty from 'pretty'
import { parse } from 'parse5'
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

function encodeAttr(val?: string) {
  if (!val) return ''
  return val.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function extractSeoFromContent(content: string): { title?: string; description?: string } {
  try {
    const doc: any = parse(`<body>${content}</body>`)
    let foundTitle: string | undefined
    let foundDesc: string | undefined

    function getText(n: any): string {
      if (!n) return ''
      if (n.nodeName === '#text') return String(n.value || '').trim()
      const children = n.childNodes || []
      let out = ''
      for (const c of children) {
        const t = getText(c)
        if (t) out += (out ? ' ' : '') + t
      }
      return out.trim()
    }

    function walk(n: any) {
      if (!n || (foundTitle && foundDesc)) return
      const tag = n.tagName
      if (!foundTitle && (tag === 'h1' || tag === 'h2' || tag === 'h3')) {
        const t = getText(n)
        if (t) foundTitle = t
      }
      if (!foundDesc && tag === 'p') {
        const t = getText(n)
        if (t && t.length >= 40) foundDesc = t
      }
      const children = n.childNodes || []
      for (const c of children) walk(c)
    }

    walk(doc)
    return { title: foundTitle, description: foundDesc }
  } catch {
    return {}
  }
}

function createHTMLDocument(content: string, title = 'App') {
  const seo = extractSeoFromContent(content)
  const pageTitle = seo.title || title
  const pageDesc = seo.description
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${encodeAttr(pageTitle)}</title>
  ${pageDesc ? `<meta name=\"description\" content=\"${encodeAttr(pageDesc)}\">` : ''}
  <meta property="og:title" content="${encodeAttr(pageTitle)}">
  ${pageDesc ? `<meta property=\"og:description\" content=\"${encodeAttr(pageDesc)}\">` : ''}
  
  <link rel="stylesheet" href="/styles.css">
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
        createRouterElementForPath(AppComponent, EntryComponent, normalizeRoutePath(path), derivePatternFromConcretePath(normalizeRoutePath(path)))
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

function createRouterElementForPath(AppComponent: any, RouteComponent: any, normalizedPath: string, routePatternPath?: string) {
  const childRoute = normalizedPath === '/'
    ? { index: true, element: React.createElement(RouteComponent) }
    : { path: (routePatternPath || normalizedPath).replace(/^\//, ''), element: React.createElement(RouteComponent) }

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
        await renderRouteToFile(normalizeRoutePath(concretePath), AppComponent, RouteComponent, outputDir, title, routePath)
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

async function renderRouteToFile(normalizedPath: string, AppComponent: any, RouteComponent: any, outputDir: string, title?: string, routePatternPath?: string) {
  const element = React.createElement(
    ThemeProvider,
    { theme: skyOSTheme },
    createRouterElementForPath(AppComponent, RouteComponent, normalizedPath, routePatternPath)
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

function derivePatternFromConcretePath(concretePath: string): string | undefined {
  if (/^\/posts\/.+/.test(concretePath)) return '/posts/:slug'
  if (/^\/category\/.+/.test(concretePath)) return '/category/:slug'
  if (/^\/tag\/.+/.test(concretePath)) return '/tag/:slug'
  if (/^\/author\/.+/.test(concretePath)) return '/author/:slug'
  return undefined
}


