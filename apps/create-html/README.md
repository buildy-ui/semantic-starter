Semantic HTML generator for React UI8Kit apps

Overview
- Author pages in React (UI8Kit), deploy pure HTML5 + semantic CSS classes (no Tailwind utilities) with zero runtime.
- Pipeline turns Tailwind utility classes into stable semantic tokens like: button, button-primary, stack-hero.
- Output per route: clean index.html, styles.css (Tailwind v4), styles.legacy.css (Tailwind v3).

What this does
1) Static HTML generation
   - Renders routes from your app router into apps/create-html/html/… via renderToStaticMarkup.
2) DOM analyze (per route)
   - Parses the rendered HTML, collects every element that has data-class and/or class (Tailwind utilities).
   - Infers missing semantic names deterministically when author forgot to set data-class.
   - Writes a compact JSON snapshot to apps/create-html/@parse/<route>.json.
3) Rewrite semantics (per route)
   - Rewrites index.html: replaces data-class + class with one semantic token (class="token").
   - Emits a per-route Tailwind input (input.css) with @apply of the exact utilities used by tokens.
4) Compile per-route CSS
   - Produces styles.css (Tailwind v4) and styles.legacy.css (Tailwind v3) next to index.html.

Quick start
1) Generate HTML (whole site or one route via targets.ts)
```bash
bun apps/create-html
```

2) Analyze a route to JSON
```bash
# Analyze About page
bun apps/create-html/scripts/analyze-dom.ts /about
# or with package script
bun run analyze:dom /about
```

3) Rewrite HTML to semantic classes and emit per-route Tailwind input
```bash
bun apps/create-html/scripts/rewrite-semantic.ts /about
# or
bun run rewrite:semantic /about
```

4) Compile CSS next to the page
```bash
# Tailwind v4 (styles.css) + Tailwind v3 (styles.legacy.css)
bun apps/create-html/scripts/compile-route-css.ts /about
# or
bun run compile:route /about
```

Tip about per‑route inputs
- rewrite-semantic.ts writes input.css. If your compile script expects input-tw4.css/input-tw3.css, copy or generate them from input.css before compiling, or adjust the scripts to emit both files.

Configuration
- apps/create-html/config/analyze.config.ts
  - routerEntryPath: path to your app router (e.g., apps/vite/src/main.tsx)
  - aliasAtPrefix: module alias prefix (e.g., '@/')
  - aliasAtRoot: file system root for that alias (e.g., apps/vite/src)
  - outputDir: where JSON reports go (default apps/create-html/@parse)
  - useLayout: true renders via App layout; false renders the route alone (useful to reduce noise)
  - inferMissingDataClass: true to infer deterministic tokens when data-class is missing

Targets (HTML generator)
- apps/create-html/config/targets.ts controls:
  - entryPath: router entry (default apps/vite/src/main.tsx)
  - outputDir: where HTML is emitted
  - cssSources: optional sources to copy base CSS assets
  - title, path (optional single-route rendering)

Naming rules (semantic tokens)
- Explicit data-class is preserved: <Title data-class="subtitle" /> → class="subtitle".
- If data-class is missing, a deterministic token is inferred from tag and class signature.
- For identical signatures, the inferred token is identical and deduplicated in JSON.

Dynamic routes
- analyze-dom.ts supports calling concrete paths (e.g., /posts/slug); it derives a dynamic pattern internally and renders the correct component.

Windows note (Git Bash)
- All scripts normalize route arguments (e.g., /C:/Program Files/Git/about → /about) so commands work in Git Bash on Windows.

End‑to‑end (example for About)
```bash
# 1) Generate site HTML
bun apps/create-html

# 2) Analyze route → JSON under @parse
bun run analyze:dom /about

# 3) Rewrite HTML → semantic tokens; emit per-route input.css
bun run rewrite:semantic /about

# 4) Compile per-route styles next to index.html
bun run compile:route /about
```

Result
- index.html now contains only semantic classes (no Tailwind utilities).
- styles.css and styles.legacy.css include exactly the @apply sets used by that page.
- You can repeat steps (2–4) for any route.