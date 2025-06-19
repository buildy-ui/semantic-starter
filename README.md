# Buildy UI Semantic Starter

## 🎯 Pure HTML5 Semantic Architecture

**Experience the future of frontend development** - Build with clean, semantic HTML5 structure that transforms Tailwind CSS utilities into production-ready semantic classes.

### ✨ What Makes This Special

- **Semantic HTML5 First**: Every element serves a meaningful purpose
- **Clean Architecture**: BEM-inspired class naming with semantic structure
- **Accessibility Ready**: Screen readers and SEO-friendly markup
- **Framework Agnostic**: Semantic HTML works everywhere
- **Production Optimized**: Clean, maintainable code that scales

### 🏗️ Semantic Component System
```typescript
// Clean, semantic imports
import { Button } from '@ui8kit/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@ui8kit/ui/card';
import { Section, SectionHeader, SectionContent } from '@ui8kit/components/section';

// Semantic HTML5 output
<section class="section">
  <header class="section-header">
    <h2 class="section-title">Clean Architecture</h2>
  </header>
  <div class="section-content">
    <div class="card">
      <button class="btn btn-primary">Semantic Button</button>
    </div>
  </div>
</section>
```

### 🎨 Development to Production Workflow
```bash
# Development with Tailwind utilities
className="bg-primary text-white rounded-md px-4 py-2 hover:bg-primary/90"

# Automatic transformation to semantic classes
class="btn btn-primary"

# Production CSS
.btn { @apply inline-flex items-center justify-center rounded-md ... }
.btn-primary { @apply bg-primary text-white hover:bg-primary/90 ... }
```

---

## Features

- ⚡️ **Vite 6** - Lightning fast build tool
- ⚛️ **React 19** - Latest React with concurrent features
- 🔷 **TypeScript** - Full type safety
- 🎨 **Semantic HTML5** - Clean, accessible markup
- 📦 **Tailwind CSS 4** - Utility-first CSS framework
- 🚀 **SWC** - Super fast compilation
- 📁 **Path Aliases** - Clean imports with `@/` prefix
- 🌐 **CDN Ready** - Semantic CSS available via CDN

## Quick Start

### Choose Your Version

```bash
# Current: Semantic HTML5 (Recommended)
git clone https://github.com/buildy-ui/app-starter.git my-project
cd my-project

# Or specific versions:

# Semantic Blog - Full semantic HTML5 blog
git clone -b semantic-blog https://github.com/buildy-ui/app-starter.git my-project

# SPA Blog - Dynamic theme switching (v0.0.2)
# Recommended for seeing utility vs semantic comparison
git clone -b spa-blog https://github.com/buildy-ui/app-starter.git my-project

# Minimal boilerplate
git clone -b boilerplate https://github.com/buildy-ui/app-starter.git my-project
```

### Release SPA Blog - Dynamic theme switching ([v0.0.2](https://github.com/buildy-ui/app-starter/releases/tag/v.0.0.2))

### Install and Run

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:5173](http://localhost:5173) to view your app.

## Available Scripts

### Development
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build

### CSS Generation
- `bun css:semantic` - Generate semantic CSS classes
- `bun css:extract` - Extract Tailwind utilities to semantic classes

## Semantic HTML5 Architecture

### Component Structure
```
src/app/ui8kit/semantic/
├── ui/                    # Base UI components
│   ├── button.tsx        # Semantic button component
│   ├── card.tsx          # Semantic card component
│   └── ...
├── components/           # Semantic layout components
│   ├── section.tsx       # Semantic section component
│   ├── article.tsx       # Semantic article component
│   └── ...
└── buildy.config.json    # Design tokens
```

### CSS Architecture
```
src/assets/css/
├── index.css             # Main stylesheet
├── semantic/             # Semantic CSS classes
│   ├── button.css       # .btn, .btn-primary, .btn-lg
│   ├── card.css         # .card, .card-header, .card-content
│   └── ...
└── source/              # Base styles
    ├── latty.css        # Icon system
    └── shadcn4.css      # Design system base
```

### Usage Examples

```typescript
// Semantic HTML5 components
import { Button } from '@ui8kit/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@ui8kit/ui/card';
import { Section, SectionHeader, SectionContent } from '@ui8kit/components/section';

function MyPage() {
  return (
    <Section>
      <SectionHeader>
        <h1>Semantic HTML5 Architecture</h1>
      </SectionHeader>
      <SectionContent>
        <Card>
          <CardHeader>
            <CardTitle>Clean Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="primary">Semantic Button</Button>
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  );
}
```

## CDN Integration

### Semantic CSS via CDN
```css
/* Import semantic styles directly */
@import "https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/button.css";
@import "https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/card.css";
@import "https://cdn.jsdelivr.net/npm/ui8kit@latest/css/dist/semantic/section.css";
```

### Local CSS Import
```css
/* src/assets/css/index.css */
@import "tailwindcss";
@import "../font/Nunito/nunito.css";
@import "./source/latty.css";

/* Semantic components */
@import "./semantic/button.css";
@import "./semantic/card.css";
@import "./semantic/section.css";
```

## Project Structure

```
├── public/
│   ├── buildy.svg           # Optimized icon
│   └── images/              # Optimized images
├── src/
│   ├── app/
│   │   ├── ui8kit/semantic/ # Semantic components
│   │   ├── components/      # App components
│   │   ├── layouts/         # Layout components
│   │   └── pages/           # Page components
│   ├── assets/
│   │   ├── css/semantic/    # Semantic CSS classes
│   │   └── font/            # Local fonts
│   ├── data/                # Static data
│   └── lib/                 # Utilities
├── CONTRIBUTING.md          # Contribution guidelines
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
└── vite.config.ts           # Vite configuration
```

## Semantic Class Examples

### Button Classes
```css
.btn { /* base button styles */ }
.btn-primary { /* primary variant */ }
.btn-secondary { /* secondary variant */ }
.btn-lg { /* large size */ }
.btn-sm { /* small size */ }
```

### Card Classes
```css
.card { /* base card styles */ }
.card-header { /* card header */ }
.card-content { /* card content */ }
.card-title { /* card title */ }
.card-description { /* card description */ }
```

### Section Classes
```css
.section { /* semantic section */ }
.section-header { /* section header */ }
.section-content { /* section content */ }
.section-title { /* section title */ }
```

## Why Semantic HTML5?

### For Developers
- **Clean Code**: Self-documenting HTML structure
- **Better Debugging**: Meaningful class names
- **Easier Maintenance**: Semantic structure is intuitive
- **Framework Agnostic**: Works with any backend

### For Performance
- **Smaller Bundles**: Semantic CSS is more efficient
- **Better Caching**: Semantic stylesheets cache better
- **Faster Rendering**: Clean HTML renders faster
- **Improved SEO**: Search engines understand semantic structure

### For Accessibility
- **Screen Reader Friendly**: Semantic elements have meaning
- **Better Navigation**: Logical document structure
- **WCAG Compliant**: Follows accessibility standards
- **Keyboard Navigation**: Semantic elements support tab order

## Comparison with Dynamic Version

### Current Version (semantic-blog)
- ✅ Pure semantic HTML5 structure
- ✅ Clean, production-ready code
- ✅ Optimized for performance and SEO
- ✅ Framework-agnostic output

### Dynamic Version (spa-blog - v0.0.2)
- 🔄 Real-time switching between utility and semantic
- 👀 Visual comparison in dev tools
- 🎓 Educational - see both approaches
- 📚 **Recommended for learning the difference**

## License

MIT License - feel free to use this starter for any project.

---

**Built with semantic HTML5 architecture**  
🌟 [Buildy UI](https://github.com/buildy-ui) - The future of frontend development