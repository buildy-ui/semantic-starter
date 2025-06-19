// bun scripts/public-generate.tsx
import React from 'react'
import { HelmetProvider } from 'react-helmet-async';
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync, existsSync, cpSync, readdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { routeConfig, type RouteInfo } from './routes.config'
import { renderContext } from '../src/data'
import pretty from 'pretty';

export const { posts } = renderContext.posts;

// Configuration
// bun generate
// npx serve public -p 8080
// npx serve examples/html-semantic -p 8080
// npx serve examples/html-utility -p 8080
const SITE_URL = "http://192.168.100.169:8080"

// Function to create HTML document
function createHTMLDocument(content: string, helmetContext: any) {
  const { helmet } = helmetContext;

  const html = `<!DOCTYPE html>
<html lang="en" ${helmet ? helmet.htmlAttributes.toString() : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${helmet ? helmet.title.toString() : '<title>Page</title>'}
  ${helmet ? helmet.meta.toString() : '<meta name="description" content="Page description">'}
  ${helmet ? helmet.link.toString() : ''}
  <link rel="stylesheet" href="${SITE_URL}/assets/css/styles.css">
  <link rel="icon" type="image/svg+xml"
    href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NyA0MCIgZmlsbD0iIzBlYTVlOSI+DQogICAgPHBhdGggZD0iTTIzLjUgNi41QzE3LjUgNi41IDEzLjc1IDkuNSAxMi4yNSAxNS41QzE0LjUgMTIuNSAxNy4xMjUgMTEuMzc1IDIwLjEyNSAxMi4xMjVDMjEuODM2NyAxMi41NTI5IDIzLjA2MDEgMTMuNzk0NyAyNC40MTQyIDE1LjE2OTJDMjYuNjIwMiAxNy40MDg0IDI5LjE3MzQgMjAgMzQuNzUgMjBDNDAuNzUgMjAgNDQuNSAxNyA0NiAxMUM0My43NSAxNCA0MS4xMjUgMTUuMTI1IDM4LjEyNSAxNC4zNzVDMzYuNDEzMyAxMy45NDcxIDM1LjE4OTkgMTIuNzA1MyAzMy44MzU3IDExLjMzMDhDMzEuNjI5NyA5LjA5MTU4IDI5LjA3NjYgNi41IDIzLjUgNi41Wk0xMi4yNSAyMEM2LjI1IDIwIDIuNSAyMyAxIDI5QzMuMjUgMjYgNS44NzUgMjQuODc1IDguODc1IDI1LjYyNUMxMC41ODY3IDI2LjA1MjkgMTEuODEwMSAyNy4yOTQ3IDEzLjE2NDIgMjguNjY5M0MxNS4zNzAyIDMwLjkwODQgMTcuOTIzNCAzMy41IDIzLjUgMzMuNUMyOS41IDMzLjUgMzMuMjUgMzAuNSAzNC43NSAyNC41QzMyLjUgMjcuNSAyOS44NzUgMjguNjI1IDI2Ljg3NSAyNy44NzVDMjUuMTYzMyAyNy40NDcxIDIzLjkzOTkgMjYuMjA1MyAyMi41ODU4IDI0LjgzMDdDMjAuMzc5OCAyMi41OTE2IDE3LjgyNjYgMjAgMTIuMjUgMjBaIj48L3BhdGg+DQo8L3N2Zz4=" />
  
</head>
<body class="bg-background text-foreground" ${helmet ? helmet.bodyAttributes.toString() : ''}>
  ${content}
  <script defer src="${SITE_URL}/assets/js/darkmode.js"></script>
</body>
</html>`

  // Format HTML with 2-space indentation
  return pretty(html, { ocd: true })
}

// Function to copy static assets
function copyStaticAssets(outputDir: string) {
  const publicDir = './public'
  const distDir = './dist'

  // Directories to copy to assets/
  const assetDirs = ['js', 'css']

  // Directories to copy to root
  const rootDirs = ['fonts', 'images']

  // Copy directories to assets/
  const assetsDir = join(outputDir, 'assets')
  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true })
  }

  // Special handling for CSS - look in dist/assets/ first, then public/
  const assetsCssDir = join(assetsDir, 'css')
  if (!existsSync(assetsCssDir)) {
    mkdirSync(assetsCssDir, { recursive: true })
  }

  // Look for any .css file in dist/assets/ directory
  let cssFound = false
  if (existsSync(distDir)) {
    try {
      const distAssetsDir = join(distDir, 'assets')
      if (existsSync(distAssetsDir)) {
        const distAssetsFiles = readdirSync(distAssetsDir)
        const cssFile = distAssetsFiles.find(file => file.endsWith('.css'))
        
        if (cssFile) {
          const sourceCssPath = join(distAssetsDir, cssFile)
          const targetCssPath = join(outputDir, 'styles.css')
          
          // Ensure assets/css/ exists
          const assetsCssDir = join(assetsDir, 'css')
          if (!existsSync(assetsCssDir)) {
            mkdirSync(assetsCssDir, { recursive: true })
          }
          
          const assetsCssPath = join(assetsCssDir, 'styles.css')
          
          // Copy to root as styles.css
          // cpSync(sourceCssPath, targetCssPath)
          // console.log(`✅ Copied: dist/assets/${cssFile} -> styles.css`)
          
          // Copy to assets/css/styles.css
          cpSync(sourceCssPath, assetsCssPath)
          console.log(`✅ Copied: dist/assets/${cssFile} -> assets/css/styles.css`)
          
          cssFound = true
        }
      }
    } catch (error) {
      console.error('❌ Error processing dist/assets directory:', error)
    }
  }

  // Copy other asset directories (skip css if we found it in dist/assets/)
  for (const dirName of assetDirs) {
    if (dirName === 'css' && cssFound) {
      console.log(`⏭️  Skipping public/css/ (using dist/assets/ CSS instead)`)
      continue
    }

    const sourceDir = join(publicDir, dirName)
    const targetDir = join(assetsDir, dirName)

    if (existsSync(sourceDir)) {
      try {
        cpSync(sourceDir, targetDir, { recursive: true })
        console.log(`✅ Copied: ${dirName}/ -> assets/${dirName}/`)
      } catch (error) {
        console.error(`❌ Error copying ${dirName} to assets:`, error)
      }
    } else {
      console.log(`⚠️  Directory not found: ${sourceDir}`)
    }
  }

  // Copy directories to root
  for (const dirName of rootDirs) {
    const sourceDir = join(publicDir, dirName)
    const targetDir = join(outputDir, dirName)

    if (existsSync(sourceDir)) {
      try {
        cpSync(sourceDir, targetDir, { recursive: true })
        console.log(`✅ Copied: ${dirName}/ -> ${dirName}/`)
      } catch (error) {
        console.error(`❌ Error copying ${dirName} to root:`, error)
      }
    } else {
      console.log(`⚠️  Directory not found: ${sourceDir}`)
    }
  }

  // Copy individual files from public to root
  const allDirs = [...assetDirs, ...rootDirs]

  try {
    const publicFiles = readdirSync(publicDir)
    for (const file of publicFiles) {
      const filePath = join(publicDir, file)
      const stat = statSync(filePath)

      // Skip styles.css if we already copied it from dist/assets/
      if (file === 'styles.css' && cssFound) {
        console.log(`⏭️  Skipping public/styles.css (using dist/assets/ CSS instead)`)
        continue
      }

      // Copy only files (not directories we already handled)
      if (stat.isFile() && !allDirs.includes(file)) {
        const targetPath = join(outputDir, file)
        cpSync(filePath, targetPath)
        console.log(`✅ Copied: ${file}`)
      }
    }
  } catch (error) {
    console.error('❌ Error copying public files:', error)
  }
}

// Main generation function
async function generateStaticSite() {
  const outputDir = './examples/html-utility'

  // First, copy static assets
  console.log('📁 Copying static assets...')
  copyStaticAssets(outputDir)

  // Then generate pages
  console.log('📄 Generating pages...')
  for (const route of routeConfig) {
    const { path } = route

    try {
      if (path.includes(':')) {
        // Dynamic route - generate pages for all matching data
        await generateDynamicPages(route, outputDir)
      } else {
        // Static route - generate as is
        await generateStaticRoute(route, outputDir)
      }
    } catch (error) {
      console.error(`❌ Error generating ${path}:`, error)
    }
  }

  console.log('🎉 Static site generation completed!')
}

// Static pages
async function generateStaticRoute(route: RouteInfo, outputDir: string) {
  const helmetContext = {};
  const content = renderToStaticMarkup(
    <HelmetProvider context={helmetContext}>
      <route.component />
    </HelmetProvider>
  );

  const filePath = route.path === '/' ? '/index.html' : `${route.path}/index.html`
  const fullPath = join(outputDir, filePath)

  const dirPath = dirname(fullPath)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
  }

  writeFileSync(fullPath, createHTMLDocument(content, helmetContext))
  console.log(`✅ Generated: ${filePath}`)
}

// Generate pages for dynamic routes
async function generateDynamicPages(route: RouteInfo, outputDir: string) {
  // Remove only the parameter, keeping the base path
  const routeBase = route.path.replace('/:slug', '')

  // Generate pages for all posts (or any data that matches this route)
  const dataForRoute = getDataForRoute(route.path)

  for (const item of dataForRoute) {
    try {
      // Use the route's paramMapper to convert data to props
      const props = route.paramMapper ? route.paramMapper({ slug: item.slug }) : { slug: item.slug }

      // Render the component with the props
      const helmetContext = {};
      const content = renderToStaticMarkup(
        <HelmetProvider context={helmetContext}>
          <route.component {...props} />
        </HelmetProvider>
      );

      // Create path: /post/slug-name/index.html
      const itemPath = join(outputDir, routeBase, item.slug, 'index.html')
      const itemDir = dirname(itemPath)

      if (!existsSync(itemDir)) {
        mkdirSync(itemDir, { recursive: true })
      }

      // Save the page
      writeFileSync(itemPath, createHTMLDocument(content, helmetContext))

      console.log(`✅ Generated: ${routeBase}/${item.slug}/index.html`)

    } catch (error) {
      console.error(`❌ Error generating ${routeBase}/${item.slug}:`, error)
    }
  }
}

// Get data that matches a specific route pattern
function getDataForRoute(routePath: string): Array<{ slug: string; title: string }> {
  // For now, we only handle /post/:slug routes
  // But this can be extended for other dynamic routes
  if (routePath === '/post/:slug') { // fixed URL pattern
    return posts.map(post => ({
      slug: post.slug,
      title: post.title
    }))
  }

  // Add more route patterns here as needed
  // if (routePath === '/category/:slug') {
  //   return categories.map(cat => ({ slug: cat.slug, title: cat.name }))
  // }

  return []
}

generateStaticSite()
