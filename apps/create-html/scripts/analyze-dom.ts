// bun apps/create-html/scripts/analyze-dom.ts /about
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { pathToFileURL } from 'url'
import { parse } from 'parse5'
import { ThemeProvider, skyOSTheme } from '@ui8kit/core'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

function normalizeRoutePath(routePath?: string) {
  if (!routePath || routePath === '/') return '/'
  return routePath.startsWith('/') ? routePath : `/${routePath}`
}

function createRouterElement(AppComponent: any, RouteComponent: any, normalizedPath: string) {
  const childRoute = normalizedPath === '/'
    ? { index: true, element: React.createElement(RouteComponent) }
    : { path: normalizedPath.replace(/^\//, ''), element: React.createElement(RouteComponent) }
  const router = createMemoryRouter([
    { path: '/', element: React.createElement(AppComponent), children: [childRoute] },
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

  const childrenBlockRegex = /children:\s*\[([\s\S]*?)\]/m
  const blockMatch = childrenBlockRegex.exec(source)
  if (!blockMatch) throw new Error('No children routes found')
  const block = blockMatch[1]
  const routeEntryRegex = /\{\s*(index:\s*true|path:\s*['"]([^'\"]+)['"])\s*,\s*element:\s*<\s*([A-Za-z0-9_]+)\s*\/>/g
  const map = new Map<string, string>()
  let r: RegExpExecArray | null
  while ((r = routeEntryRegex.exec(block)) !== null) {
    const isIndex = r[1] && r[1].includes('index')
    const p = isIndex ? '/' : `/${r[2]}`
    map.set(p, r[3])
  }

  const normalized = normalizeRoutePath(routePath)
  const compName = map.get(normalized)
  if (!compName) throw new Error(`Route not found: ${normalized}`)

  const appNameMatch = /element:\s*<\s*([A-Za-z0-9_]+)\s*\/>[\s\S]*?children\s*:\s*\[/m.exec(source)
  if (!appNameMatch) throw new Error('Root App element not found')
  const appName = appNameMatch[1]

  const resolve = (spec: string) => {
    const base = spec.startsWith('@/')
      ? join(process.cwd(), 'apps/vite/src', spec.slice(2))
      : join(process.cwd(), 'apps/vite/src', spec)
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
  return { App, Route }
}

function collectNodes(node: any, out: any[], idxPath = 'root') {
  const asEl = node as any
  if ((asEl as any).nodeName && (asEl as any).attrs) {
    const tag = (asEl as any).tagName
    const attrs = Object.fromEntries(((asEl as any).attrs || []).map((a: any) => [a.name, a.value]))
    const dataClass = attrs['data-class']
    const className = attrs['class']
    if (dataClass || className) {
      out.push({ path: idxPath, tag, dataClass, className })
    }
  }
  const children = (node as any).childNodes || []
  children.forEach((c: any, i: number) => collectNodes(c, out, `${idxPath}.${c.tagName || c.nodeName}[${i}]`))
}

async function main() {
  const rawArg = process.argv[2] || 'about'
  const routeArg = sanitizeRouteArg(rawArg)
  const normalized = normalizeRoutePath(routeArg)
  const { App, Route } = await loadRouteComponents('apps/vite/src/main.tsx', normalized)
  const element = React.createElement(ThemeProvider as any, { theme: skyOSTheme, children: createRouterElement(App, Route, normalized) })
  const html = renderToStaticMarkup(element)
  const doc = parse(html) as any
  const report: any[] = []
  collectNodes(doc, report)
  // Write to @parse/<name>.json under apps/create-html
  const outDir = join(process.cwd(), 'apps/create-html', '@parse')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  const fileBase = normalized === '/' ? 'index' : normalized.replace(/^\//, '').replace(/\//g, '-')
  const outPath = join(outDir, `${fileBase}.json`)
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(`\n✅ Wrote report: ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

function sanitizeRouteArg(arg: string): string {
  if (!arg) return '/'
  // Handle Git Bash on Windows path rewrite like "/C:/Program Files/Git/about"
  if (/^\/[A-Za-z]:\//.test(arg)) {
    const parts = arg.split(/[\\/]+/).filter(Boolean)
    const last = parts[parts.length - 1]
    return last || '/'
  }
  // Handle Windows style paths like "C:\\...\\about" or "C:/.../about"
  if (/^[A-Za-z]:[\\/]/.test(arg)) {
    const parts = arg.split(/[\\/]+/).filter(Boolean)
    const last = parts[parts.length - 1]
    return last || '/'
  }
  return arg
}


