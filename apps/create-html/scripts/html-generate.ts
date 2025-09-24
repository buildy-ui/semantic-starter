// @ts-nocheck
// bun scripts/html-generate.ts
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync, existsSync, cpSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'
import pretty from 'pretty'

type GenerateOptions = {
  entryPath: string
  outputDir: string
  cssSources: string[]
  title?: string
}

function createHTMLDocument(content: string, title = 'App') {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="assets/css/styles.css">
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
  const { entryPath, outputDir, cssSources, title } = options
  console.log(`📄 Rendering ${entryPath} to static HTML...`)

  const absEntryPath = join(process.cwd(), entryPath)
  const entryModule = await import(pathToFileURL(absEntryPath).href)
  const EntryComponent = entryModule.default
  if (!EntryComponent) {
    throw new Error(`Default export not found in ${entryPath}`)
  }

  const content = renderToStaticMarkup(React.createElement(EntryComponent))

  const fullPath = join(outputDir, 'index.html')
  const dirPath = dirname(fullPath)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  writeFileSync(fullPath, createHTMLDocument(content, title))
  console.log(`✅ Generated: ${fullPath}`)

  console.log('📁 Copying CSS...')
  copyCssToAssets(outputDir, cssSources)
}


