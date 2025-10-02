// bun apps/create-html/scripts/analyze-dom.ts /about
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { pathToFileURL } from 'url'
import { parse } from 'parse5'
import { ThemeProvider, skyOSTheme } from '@ui8kit/core'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { analyzeDomConfig } from '../config/analyze.config'
import { inferDataClass } from './utils/inferDataClass'

function normalizeRoutePath(routePath?: string) {
  if (!routePath || routePath === '/') return '/'
  return routePath.startsWith('/') ? routePath : `/${routePath}`
}

function createRouterElement(options: {
  AppComponent?: any,
  RouteComponent: any,
  normalizedPath: string,
  routePatternPath?: string,
  useLayout: boolean,
}) {
  const { AppComponent, RouteComponent, normalizedPath, routePatternPath, useLayout } = options
  if (useLayout && AppComponent) {
    const childRoute = normalizedPath === '/'
      ? { index: true, element: React.createElement(RouteComponent) }
      : { path: (routePatternPath || normalizedPath).replace(/^\//, ''), element: React.createElement(RouteComponent) }
    const router = createMemoryRouter([
      { path: '/', element: React.createElement(AppComponent), children: [childRoute] },
    ], { initialEntries: [normalizedPath] })
    return React.createElement(RouterProvider, { router })
  }
  // Direct route rendering without App layout
  const directPath = normalizedPath === '/' ? '/' : (routePatternPath || normalizedPath)
  const router = createMemoryRouter([
    { path: directPath, element: React.createElement(RouteComponent) },
  ], { initialEntries: [normalizedPath] })
  return React.createElement(RouterProvider, { router })
}

async function loadRouteComponents(entryPath: string, routePath: string) {
  const absEntryPath = join(process.cwd(), entryPath)
  const source = await (await import('fs')).promises.readFile(absEntryPath, 'utf8')

  // Lightweight extractors (mirrors html-generate.ts)
  const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'\"]+)['"];?/g
  const imports = new Map<string, string>()
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(source)) !== null) imports.set(m[1], m[2])

  // Extract router array content
  const routerArrayRegex = /createBrowserRouter\(\s*\[([\s\S]*?)\]\s*\)/m
  const arrayMatch = routerArrayRegex.exec(source)
  if (!arrayMatch) throw new Error('Router array not found in entry file')
  const arrayBlock = arrayMatch[1]

  // Parse children routes from the first route object
  const childrenBlockRegex = /children:\s*\[([\s\S]*?)\]/m
  const blockMatch = childrenBlockRegex.exec(source)
  const childrenBlock = blockMatch ? blockMatch[1] : ''
  const routeEntryRegex = /\{\s*(index:\s*true|path:\s*['"]([^'\"]+)['"])\s*,\s*element:\s*<\s*([A-Za-z0-9_]+)\s*\/>/g

  const childrenMap = new Map<string, string>()
  let r: RegExpExecArray | null
  if (childrenBlock) {
    while ((r = routeEntryRegex.exec(childrenBlock)) !== null) {
      const isIndex = r[1] && r[1].includes('index')
      const raw = r[2]
      const p = isIndex ? '/' : (raw && raw.startsWith('/') ? raw : `/${raw}`)
      childrenMap.set(p, r[3])
    }
  }

  // Parse top-level routes by removing children blocks
  const topBlock = arrayBlock.replace(/children:\s*\[(?:[\s\S]*?)\]/g, '')
  const topMap = new Map<string, string>()
  while ((r = routeEntryRegex.exec(topBlock)) !== null) {
    const isIndex = r[1] && r[1].includes('index')
    const raw = r[2]
    const p = isIndex ? '/' : (raw && raw.startsWith('/') ? raw : `/${raw}`)
    topMap.set(p, r[3])
  }

  const normalized = normalizeRoutePath(routePath)
  // Identify App component name to avoid mapping '/' -> App
  const appNameMatch = /element:\s*<\s*([A-Za-z0-9_]+)\s*\/>[\s\S]*?children\s*:\s*\[/m.exec(source)
  if (!appNameMatch) throw new Error('Root App element not found')
  const appName = appNameMatch[1]

  // Build final route map: top-level (excluding root App) + children (override)
  if (topMap.get('/') === appName) {
    topMap.delete('/')
  }
  const map = new Map<string, string>(topMap)
  for (const [k, v] of childrenMap) map.set(k, v)

  let compName = map.get(normalized)
  if (!compName && normalized === '/') {
    const idxMatch = /index\s*:\s*true[\s\S]*?element\s*:\s*<\s*([A-Za-z0-9_]+)\s*\/>/m.exec(block)
    if (idxMatch) {
      compName = idxMatch[1]
    }
  }
  // Try dynamic pattern resolution (e.g., /posts/:slug)
  let routePatternPath: string | undefined
  if (!compName) {
    // 1) Derive by known prefix patterns
    routePatternPath = derivePatternFromConcretePath(normalized)
    if (routePatternPath) {
      compName = map.get(routePatternPath)
    }
  }
  if (!compName) {
    // 2) Fallback: scan map for keys with ":" param and prefix-match
    for (const [key, val] of map.entries()) {
      if (key.includes('/:')) {
        const base = key.replace('/:slug', '/')
        if (normalized.startsWith(base)) {
          compName = val
          routePatternPath = key
          break
        }
      }
    }
  }
  if (!compName) {
    const available = Array.from(map.keys()).join(', ')
    throw new Error(`Route not found: ${normalized}. Available: ${available || '(none found)'}`)
  }

  const resolve = (spec: string) => {
    const { aliasAtPrefix, aliasAtRoot } = analyzeDomConfig
    const base = spec.startsWith(aliasAtPrefix)
      ? join(process.cwd(), aliasAtRoot, spec.slice(aliasAtPrefix.length))
      : join(process.cwd(), aliasAtRoot, spec)
    const candidates = [`${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`, join(base, 'index.tsx'), join(base, 'index.ts')]
    const { existsSync } = require('fs')
    const found = candidates.find((p) => existsSync(p))
    if (!found) throw new Error(`Cannot resolve ${spec}`)
    return found
  }

  const appSpec = imports.get(appName)!
  const routeSpec = imports.get(compName)!
  const App = (await import(pathToFileURL(resolve(appSpec)).href)).default
  const Route = (await import(pathToFileURL(resolve(routeSpec)).href)).default
  return { App, Route, routePatternPath }
}

const baseTokenHyphenRule = (token?: string) => !!token && !token.includes('-')

function normalizeClasses(str?: string) {
  return (str || '')
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ')
}

function collectNodes(node: any, out: any[], idxPath = 'root') {
  const asEl = node as any
  if ((asEl as any).nodeName && (asEl as any).attrs) {
    const tag = (asEl as any).tagName
    const attrs = Object.fromEntries(((asEl as any).attrs || []).map((a: any) => [a.name, a.value]))
    const className = attrs['class']
    const normalized = normalizeClasses(className)
    let dataClass = attrs['data-class']

    if (analyzeDomConfig.inferMissingDataClass) {
      // If no explicit token -> infer from tag/classes
      if (!dataClass && (tag || className)) {
        const inferred = inferDataClass({ tag, className })
        if (inferred) dataClass = inferred
      }
      // If explicit base token (e.g., "stack") but classes present -> promote to stable variant id
      if (baseTokenHyphenRule(dataClass) && normalized) {
        dataClass = `${dataClass}-${shortHash(normalized)}`
      }
    }

    if (dataClass || className) out.push({ path: idxPath, tag, dataClass, className })
  }
  const children = (node as any).childNodes || []
  children.forEach((c: any, i: number) => collectNodes(c, out, `${idxPath}.${c.tagName || c.nodeName}[${i}]`))
}

async function main() {
  const rawArg = process.argv[2] || 'about'
  const routeArg = sanitizeRouteArg(rawArg)
  const normalized = normalizeRoutePath(routeArg)
  const { routerEntryPath, outputDir } = analyzeDomConfig
  const { App, Route, routePatternPath } = await loadRouteComponents(routerEntryPath, normalized)
  const element = React.createElement(ThemeProvider as any, { theme: skyOSTheme, children: createRouterElement({ AppComponent: App, RouteComponent: Route, normalizedPath: normalized, routePatternPath, useLayout: analyzeDomConfig.useLayout }) })
  const html = renderToStaticMarkup(element)
  const doc = parse(html) as any
  const report: any[] = []
  collectNodes(doc, report)
  // Dedupe by (dataClass || tag) signature + className
  const seen = new Set<string>()
  const unique: any[] = []
  for (const rec of report) {
    const key = `${rec.dataClass || rec.tag}|${normalizeClasses(rec.className)}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(rec)
  }
  // Write to @parse/<name>.json under apps/create-html
  const outDir = join(process.cwd(), outputDir)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  const fileBase = normalized === '/' ? 'index' : normalized.replace(/^\//, '').replace(/\//g, '-')
  const outPath = join(outDir, `${fileBase}.json`)
  writeFileSync(outPath, JSON.stringify(unique, null, 2))
  console.log(`\n✅ Wrote report: ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

function sanitizeRouteArg(arg: string): string {
  if (!arg) return '/'
  // Direct root indicators
  if (arg === '/' || arg === '\\') return '/'
  // Handle Git Bash on Windows path rewrite like "/C:/Program Files/Git/about"
  if (/^\/[A-Za-z]:\//.test(arg)) {
    const parts = arg.split(/[\\/]+/).filter(Boolean)
    const gitIdx = parts.findIndex(p => p.toLowerCase() === 'git')
    if (gitIdx !== -1) {
      const tail = parts.slice(gitIdx + 1)
      if (tail.length === 0) return '/'
      return tail.join('/')
    }
    const last = parts[parts.length - 1]
    return last || '/'
  }
  // Handle Windows style paths like "C:\\...\\about" or "C:/.../about"
  if (/^[A-Za-z]:[\\/]/.test(arg)) {
    const parts = arg.split(/[\\/]+/).filter(Boolean)
    const gitIdx = parts.findIndex(p => p.toLowerCase() === 'git')
    if (gitIdx !== -1) {
      const tail = parts.slice(gitIdx + 1)
      if (tail.length === 0) return '/'
      return tail.join('/')
    }
    const last = parts[parts.length - 1]
    return last || '/'
  }
  return arg
}

function derivePatternFromConcretePath(concretePath: string): string | undefined {
  if (/^\/posts\/.+/.test(concretePath)) return '/posts/:slug'
  if (/^\/category\/.+/.test(concretePath)) return '/category/:slug'
  if (/^\/tag\/.+/.test(concretePath)) return '/tag/:slug'
  if (/^\/author\/.+/.test(concretePath)) return '/author/:slug'
  return undefined
}

// Local hash identical to utils/inferDataClass to avoid circular import
function shortHash(str: string): string {
  let h = 0x811c9dc5 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return (h.toString(36)).slice(0, 7)
}


