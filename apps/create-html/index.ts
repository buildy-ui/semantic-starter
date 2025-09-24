// Entry point to generate static HTML for configured targets
import { targets } from './config/targets'
import { generateHtml } from './scripts/html-generate'

async function run() {
  for (const t of targets) {
    try {
      console.log(`\n▶️  Building target: ${t.name}`)
      await generateHtml({
        entryPath: t.entryPath,
        outputDir: t.outputDir,
        cssSources: t.cssSources,
        title: t.title,
      })
    } catch (err) {
      console.error(`❌ Failed target: ${t.name}`)
      console.error(err)
    }
  }
}

run()


