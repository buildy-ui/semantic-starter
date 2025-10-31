// bun apps/create-html/scripts/compile-route-css.ts /about
import { join } from 'path'
import { targets } from '../config/targets'

async function main() {
  // Always compile site root using shared assets input (Tailwind v4)
  const pageDir = join(process.cwd(), targets[0].outputDir)

  // Compile Tailwind v4/v3 CSS for this route
  const inputCssTW4 = join(process.cwd(), 'apps/create-html/assets/input-tw4.css')
  const stylesCss = join(pageDir, 'styles.css')

  // Run in route directory to make relative content globs resolve correctly
  const tw4 = Bun.spawn({
    cmd: ['bun', 'x', '@tailwindcss/cli', '-i', inputCssTW4, '-o', stylesCss, '--minify'],
    cwd: pageDir,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const tw4Code = await tw4.exited
  if (tw4Code !== 0) throw new Error('Tailwind v4 build failed')
  console.log(`\n✅ Compiled: ${stylesCss}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


