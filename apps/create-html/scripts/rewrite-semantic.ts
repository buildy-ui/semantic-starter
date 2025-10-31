// bun apps/create-html/scripts/rewrite-semantic.ts /about
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { parse, serialize } from 'parse5'
import { targets } from '../config/targets'
import { analyzeDomConfig } from '../config/analyze.config'

type JsonEntry = { path: string; tag?: string; dataClass?: string; className?: string }

function normalizeRoutePath(routePath?: string) {
  if (!routePath || routePath === '/') return '/'
  return routePath.startsWith('/') ? routePath : `/${routePath}`
}

function sanitizeRouteArg(arg: string): string {
  if (!arg) return '/'
  if (arg === '/' || arg === '\\') return '/'
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

function toFileBase(normalized: string) {
  return normalized === '/' ? 'index' : normalized.replace(/^\//, '').replace(/\//g, '-')
}

function normalizeClasses(str?: string) {
  return (str || '').split(/\s+/).filter(Boolean).sort().join(' ')
}

function rewriteHtmlWithTokens(html: string, classToToken: Map<string, string>) {
  const doc: any = parse(html)

  function walk(node: any) {
    if (node && node.attrs) {
      const attrs: Record<string, string> = Object.fromEntries((node.attrs || []).map((a: any) => [a.name, a.value]))
      const dc = attrs['data-class']
      const cls = attrs['class']
      if (dc && cls) {
        const sig = normalizeClasses(cls)
        const token = classToToken.get(sig) || dc
        // replace class with token and drop data-class
        node.attrs = (node.attrs || []).filter((a: any) => a.name !== 'data-class' && a.name !== 'class')
        node.attrs.push({ name: 'class', value: token })
      }
    }
    const children = node.childNodes || []
    for (const c of children) walk(c)
  }

  walk(doc)
  return serialize(doc)
}

function buildApplyCss(entries: JsonEntry[]) {
  // Map token -> classes (first occurrence wins)
  const tokenToClasses = new Map<string, string>()
  for (const e of entries) {
    if (!e.dataClass || !e.className) continue
    if (!tokenToClasses.has(e.dataClass)) {
      tokenToClasses.set(e.dataClass, normalizeClasses(e.className))
    }
  }
  const lines: string[] = []
  lines.push('@layer components {')
  for (const [token, cls] of tokenToClasses) {
    if (!token || !cls) continue
    lines.push(`  .${token} { @apply ${cls}; }`)
  }
  lines.push('}')
  return lines.join('\n')
}

async function main() {
  const rawArg = process.argv[2] || '/'
  const routeArg = sanitizeRouteArg(rawArg)
  const normalized = normalizeRoutePath(routeArg)
  const fileBase = toFileBase(normalized)

  // Load JSON for this route
  const jsonDir = analyzeDomConfig.outputDir
  const jsonPath = join(process.cwd(), jsonDir, `${fileBase}.json`)
  if (!existsSync(jsonPath)) {
    console.warn(`⚠️  JSON not found for route ${normalized}: ${jsonPath}. Skipping.`)
    return
  }
  const json: JsonEntry[] = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const classToToken = new Map<string, string>()
  for (const e of json) {
    if (!e.dataClass || !e.className) continue
    const sig = normalizeClasses(e.className)
    if (!classToToken.has(sig)) classToToken.set(sig, e.dataClass)
  }

  // If route is provided → process only that route directory
  if (process.argv[2] && normalized !== '/') {
    // Find the first target where HTML exists
    let htmlPath: string | null = null
    let pageDir: string | null = null
    for (const t of targets) {
      const dir = join(t.outputDir, normalized.replace(/^\//, ''))
      const candidate = join(process.cwd(), dir, 'index.html')
      if (existsSync(candidate)) {
        htmlPath = candidate
        pageDir = join(process.cwd(), dir)
        break
      }
    }
    if (!htmlPath || !pageDir) throw new Error(`index.html not found for route ${normalized}`)
    const html = readFileSync(htmlPath, 'utf8')
    const rewritten = rewriteHtmlWithTokens(html, classToToken)
    writeFileSync(htmlPath, rewritten)
    const cssPath = join(pageDir, 'input.css')
    writeFileSync(cssPath, buildApplyCss(json))
    console.log(`\n✅ Rewrote: ${htmlPath}`)
    console.log(`✅ CSS: ${cssPath}`)
    return
  }

  // No route or '/' → process whole site: rewrite all pages and emit one shared input.css at site root
  // 1) Aggregate all tokens and classes from every JSON in @parse
  const parseDir = join(process.cwd(), analyzeDomConfig.outputDir)
  const aggregateEntries: JsonEntry[] = []
  if (existsSync(parseDir)) {
    const files = readdirSync(parseDir)
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      try {
        const arr: JsonEntry[] = JSON.parse(readFileSync(join(parseDir, f), 'utf8'))
        aggregateEntries.push(...arr)
      } catch {}
    }
  }
  const aggregateMap = new Map<string, string>()
  for (const e of aggregateEntries) {
    if (!e.dataClass || !e.className) continue
    const sig = normalizeClasses(e.className)
    if (!aggregateMap.has(sig)) aggregateMap.set(sig, e.dataClass)
  }

  for (const t of targets) {
    const rootDir = join(process.cwd(), t.outputDir)
    const siteCssPath = join(rootDir, 'input.css')
    writeFileSync(siteCssPath, buildApplyCss(aggregateEntries))

    // 2) Recursively rewrite every index.html under outputDir
    const htmlPaths: string[] = []
    const walk = (dir: string) => {
      const items = readdirSync(dir)
      for (const name of items) {
        const p = join(dir, name)
        const st = statSync(p)
        if (st.isDirectory()) walk(p)
        else if (st.isFile() && name === 'index.html') htmlPaths.push(p)
      }
    }
    if (existsSync(rootDir)) walk(rootDir)

    for (const htmlPath of htmlPaths) {
      const html = readFileSync(htmlPath, 'utf8')
      const rewritten = rewriteHtmlWithTokens(html, aggregateMap)
      writeFileSync(htmlPath, rewritten)
      console.log(`✅ Rewrote: ${htmlPath}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


