// bun scripts/html-generate.tsx
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync, existsSync, cpSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import pretty from 'pretty'
import App from '../src/app/index'

// Output directory for the generated HTML and CSS
const outputDir = './examples/html'

// Create a minimal HTML document with a single stylesheet
function createHTMLDocument(content: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App</title>
  <link rel="stylesheet" href="assets/css/styles.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGJiYTciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib3gtaWNvbiBsdWNpZGUtYm94Ij48cGF0aCBkPSJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaIi8+PHBhdGggZD0ibTMuMyA3IDguNyA1IDguNy01Ii8+PHBhdGggZD0iTTEyIDIyVjEyIi8+PC9zdmc+" />
</head>
<body class="bg-background text-foreground">
  ${content}
</body>
</html>`

  return pretty(html, { ocd: true })
}

// Copy a single CSS file from dist/assets to assets/css/styles.css
function copyCssToAssets(targetRoot: string) {
  const distAssetsDir = './dist/assets'
  if (!existsSync(distAssetsDir)) {
    console.warn('⚠️  dist/assets not found. Build the app to generate CSS.')
    return
  }

  const files = readdirSync(distAssetsDir)
  const cssFile = files.find(f => f.endsWith('.css'))
  if (!cssFile) {
    console.warn('⚠️  No CSS file found in dist/assets')
    return
  }

  const assetsCssDir = join(targetRoot, 'assets', 'css')
  if (!existsSync(assetsCssDir)) {
    mkdirSync(assetsCssDir, { recursive: true })
  }

  const sourceCssPath = join(distAssetsDir, cssFile)
  const targetCssPath = join(assetsCssDir, 'styles.css')
  cpSync(sourceCssPath, targetCssPath)
  console.log(`✅ Copied: dist/assets/${cssFile} -> assets/css/styles.css`)
}

// Generate a single index.html from src/app/index.tsx
function generate() {
  console.log('📄 Rendering App to static HTML...')
  const content = renderToStaticMarkup(<App />)

  const fullPath = join(outputDir, 'index.html')
  const dirPath = dirname(fullPath)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  writeFileSync(fullPath, createHTMLDocument(content))
  console.log('✅ Generated: index.html')

  console.log('📁 Copying CSS...')
  copyCssToAssets(outputDir)
}

generate()
