// bun apps/create-html/generate

import { RouteToStatic } from './scripts/routeToStatic'

const generator = new RouteToStatic()
generator.configure({
  entryPath: 'apps/vite/src/main.tsx',
  outputDir: './www/vite',
  cssSources: ['apps/vite/src/assets/css/styles.css'],
  title: 'My HTML App',
  dataModulePath: 'apps/vite/src/data/index.ts'
})
await generator.generateAll()