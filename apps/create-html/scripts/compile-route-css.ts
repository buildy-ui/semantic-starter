// bun apps/create-html/scripts/compile-route-css.ts /about
import { existsSync } from 'fs'
import { join } from 'path'
import { targets } from '../config/targets'

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

async function main() {
  const rawArg = process.argv[2] || '/'
  const normalized = normalizeRoutePath(sanitizeRouteArg(rawArg))
  // Find route dir
  let pageDir: string | null = null
  for (const t of targets) {
    const dir = normalized === '/' ? t.outputDir : join(t.outputDir, normalized.replace(/^\//, ''))
    const htmlPath = join(process.cwd(), dir, 'index.html')
    if (existsSync(htmlPath)) {
      pageDir = join(process.cwd(), dir)
      break
    }
  }
  if (!pageDir) throw new Error(`Page not found for ${normalized}. Run generator first.`)

  // Compile Tailwind v4/v3 CSS for this route
  const inputCssTW4 = existsSync(join(pageDir, 'input-tw4.css'))
    ? join(pageDir, 'input-tw4.css')
    : join(pageDir, 'input.css')
  const inputCssTW3 = existsSync(join(pageDir, 'input-tw3.css'))
    ? join(pageDir, 'input-tw3.css')
    : join(pageDir, 'input.css')
  const configJs = existsSync(join(pageDir, 'tailwind.config.js'))
    ? join(pageDir, 'tailwind.config.js')
    : join(process.cwd(), 'apps/create-html/config/tailwind.config.js')
  const stylesCss = join(pageDir, 'styles.css')
  const legacyCss = join(pageDir, 'styles.legacy.css')

  // Run in route directory to make relative content globs resolve correctly
  const tw4 = Bun.spawn({
    cmd: ['bun', 'x', '@tailwindcss/cli', '-i', inputCssTW4, '-o', stylesCss, '--minify'],
    cwd: pageDir,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const tw4Code = await tw4.exited
  if (tw4Code !== 0) throw new Error('Tailwind v4 build failed')

  // Use the vendored alias tailwindcss3 (npm:tailwindcss@3.4.14) to ensure modern v3 with @apply variants
  const tw3 = Bun.spawn({
    cmd: ['bun', 'x', 'tailwindcss@3', '-i', inputCssTW3, '-o', legacyCss, '--minify', '-c', configJs],
    cwd: pageDir,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const tw3Code = await tw3.exited
  if (tw3Code !== 0) throw new Error('Tailwind v3 build failed')
  console.log(`\n✅ Compiled: ${stylesCss}\n✅ Compiled: ${legacyCss}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


