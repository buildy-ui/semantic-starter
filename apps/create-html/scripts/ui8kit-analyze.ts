// bun apps/create-html/scripts/ui8kit-analyze.ts
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { pathToFileURL } from 'url'
import { parse } from 'parse5'
import { ThemeProvider, skyOSTheme } from '@ui8kit/core'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ui8kitAnalyzeConfig } from '../config/ui8kit.config'

type NamespaceKey = string

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
  const directPath = normalizedPath === '/' ? '/' : (routePatternPath || normalizedPath)
  const router = createMemoryRouter([
    { path: directPath, element: React.createElement(RouteComponent) },
  ], { initialEntries: [normalizedPath] })
  return React.createElement(RouterProvider, { router })
}

async function loadRouteComponents(entryPath: string, routePath: string) {
  const absEntryPath = join(process.cwd(), entryPath)
  const source = await (await import('fs')).promises.readFile(absEntryPath, 'utf8')

  const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'\"]+)['"];?/g
  const imports = new Map<string, string>()
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(source)) !== null) imports.set(m[1], m[2])

  const routerArrayRegex = /createBrowserRouter\(\s*\[([\s\S]*?)\]\s*\)/m
  const arrayMatch = routerArrayRegex.exec(source)
  if (!arrayMatch) throw new Error('Router array not found in entry file')
  const arrayBlock = arrayMatch[1]

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

  const topBlock = arrayBlock.replace(/children:\s*\[(?:[\s\S]*?)\]/g, '')
  const topMap = new Map<string, string>()
  while ((r = routeEntryRegex.exec(topBlock)) !== null) {
    const isIndex = r[1] && r[1].includes('index')
    const raw = r[2]
    const p = isIndex ? '/' : (raw && raw.startsWith('/') ? raw : `/${raw}`)
    topMap.set(p, r[3])
  }

  const normalized = normalizeRoutePath(routePath)
  const appNameMatch = /element:\s*<\s*([A-Za-z0-9_]+)\s*\/>[\s\S]*?children\s*:\s*\[/m.exec(source)
  if (!appNameMatch) throw new Error('Root App element not found')
  const appName = appNameMatch[1]

  if (topMap.get('/') === appName) topMap.delete('/')
  const map = new Map<string, string>(topMap)
  for (const [k, v] of childrenMap) map.set(k, v)

  let compName = map.get(normalized)
  if (!compName && normalized === '/') {
    const idxMatch = /index\s*:\s*true[\s\S]*?element\s*:\s*<\s*([A-Za-z0-9_]+)\s*\/>/m.exec(childrenBlock)
    if (idxMatch) compName = idxMatch[1]
  }
  return { imports, appName, compName }
}

async function resolveImportToFile(spec: string) {
  const { aliasAtPrefix, aliasAtRoot } = ui8kitAnalyzeConfig
  const base = spec.startsWith(aliasAtPrefix)
    ? join(process.cwd(), aliasAtRoot, spec.slice(aliasAtPrefix.length))
    : join(process.cwd(), aliasAtRoot, spec)
  const candidates = [
    `${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`,
    join(base, 'index.tsx'), join(base, 'index.ts')
  ]
  const { existsSync } = await import('fs')
  const found = candidates.find((p) => existsSync(p))
  if (!found) throw new Error(`Cannot resolve ${spec}`)
  return found
}

async function listAllRoutes(entryPath: string): Promise<string[]> {
  const absEntryPath = join(process.cwd(), entryPath)
  const source = await (await import('fs')).promises.readFile(absEntryPath, 'utf8')
  const routerArrayRegex = /createBrowserRouter\(\s*\[([\s\S]*?)\]\s*\)/m
  const arrayMatch = routerArrayRegex.exec(source)
  if (!arrayMatch) return ['/']
  const arrayBlock = arrayMatch[1]
  const childrenBlockRegex = /children:\s*\[([\s\S]*?)\]/m
  const blockMatch = childrenBlockRegex.exec(source)
  const childrenBlock = blockMatch ? blockMatch[1] : ''
  const routeEntryRegex = /\{\s*(index:\s*true|path:\s*['"]([^'\"]+)['"])\s*,\s*element:\s*<\s*([A-Za-z0-9_]+)\s*\/>/g

  const childrenPaths: string[] = []
  let r: RegExpExecArray | null
  if (childrenBlock) {
    while ((r = routeEntryRegex.exec(childrenBlock)) !== null) {
      const isIndex = r[1] && r[1].includes('index')
      const raw = r[2]
      const p = isIndex ? '/' : (raw && raw.startsWith('/') ? raw : `/${raw}`)
      childrenPaths.push(p)
    }
  }
  const topBlock = arrayBlock.replace(/children:\s*\[(?:[\s\S]*?)\]/g, '')
  const topPaths: string[] = []
  while ((r = routeEntryRegex.exec(topBlock)) !== null) {
    const isIndex = r[1] && r[1].includes('index')
    const raw = r[2]
    const p = isIndex ? '/' : (raw && raw.startsWith('/') ? raw : `/${raw}`)
    topPaths.push(p)
  }
  return Array.from(new Set([...topPaths, ...childrenPaths]))
}

function normalizeClasses(str?: string) {
  return (str || '')
    .split(/\s+/)
    .filter(Boolean)
    .sort()
    .join(' ')
}

function collectNodes(node: any, out: any[]) {
  const asEl = node as any
  if ((asEl as any).nodeName && (asEl as any).attrs) {
    const attrs = Object.fromEntries(((asEl as any).attrs || []).map((a: any) => [a.name, a.value]))
    const className = attrs['class']
    const normalized = normalizeClasses(className)
    if (normalized) out.push(normalized)
  }
  const children = (node as any).childNodes || []
  children.forEach((c: any) => collectNodes(c, out))
}

async function determineNamespacesFromEntry(entryPath: string): Promise<Set<NamespaceKey>> {
  const absEntryPath = join(process.cwd(), entryPath)
  const source = await (await import('fs')).promises.readFile(absEntryPath, 'utf8')
  const ns = new Set<NamespaceKey>()
  const importRegex = /from\s+['"]@ui8kit\/([^'\"/]+)(?:\/[^'\"]*)?['"]/g
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(source)) !== null) ns.add(m[1])
  return ns
}

async function main() {
  const cfg = ui8kitAnalyzeConfig
  const namespaces = cfg.trackNamespaces === 'auto'
    ? await determineNamespacesFromEntry(cfg.routerEntryPath)
    : new Set<NamespaceKey>(cfg.trackNamespaces)

  const routes = await listAllRoutes(cfg.routerEntryPath)
  const perNsSets = new Map<NamespaceKey, Set<string>>()
  for (const ns of namespaces) perNsSets.set(ns, new Set<string>())

  for (const routePath of routes) {
    try {
      const { imports, appName, compName } = await loadRouteComponents(cfg.routerEntryPath, routePath)
      if (!compName) continue
      const appSpec = imports.get(appName)!
      const routeSpec = imports.get(compName)!
      // Determine namespace by import path of route component if it comes from @ui8kit/*
      const routeNsMatch = /@ui8kit\/([^/]+)/.exec(routeSpec)
      const targetNamespaces = routeNsMatch ? [routeNsMatch[1]] : Array.from(namespaces)

      const App = (await import(pathToFileURL(await resolveImportToFile(appSpec)).href)).default
      const Route = (await import(pathToFileURL(await resolveImportToFile(routeSpec)).href)).default

      const element = React.createElement(ThemeProvider as any, { theme: skyOSTheme, children: createRouterElement({ AppComponent: App, RouteComponent: Route, normalizedPath: routePath, useLayout: cfg.useLayout }) })
      const html = renderToStaticMarkup(element)
      const doc = parse(html) as any
      const bucket: string[] = []
      collectNodes(doc, bucket)
      const unique = Array.from(new Set(bucket.flatMap(s => s.split(' ')).filter(Boolean)))
      for (const ns of targetNamespaces) {
        const set = perNsSets.get(ns)
        if (!set) continue
        unique.forEach(c => set.add(c))
      }
    } catch (err) {
      console.warn(`⚠️  Failed analyzing route ${routePath}:`, (err as any).message || err)
      continue
    }
  }

  const outDir = join(process.cwd(), cfg.outputDir)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  for (const [ns, set] of perNsSets.entries()) {
    const outPath = join(outDir, `${ns}.json`)
    writeFileSync(outPath, JSON.stringify(Array.from(set).sort(), null, 2))
    console.log(`✅ Wrote ${ns} classes: ${outPath} (${set.size})`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


