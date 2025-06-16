# Buildy UI App Starter

## 🎯 What Makes This Special?

**Switch between CSS methodologies instantly** - Experience the same React components with different styling approaches without changing a single line of component code.

### ⚡ Dual Mode System
- **Utility Mode**: Components styled with Tailwind CSS utility classes
- **Semantic Mode**: Components using semantic HTML structure and CSS classes
- **Live Switching**: Toggle between modes in real-time during development
- **Fixed Mode**: Lock to one mode for production builds

### 🔄 Dynamic Component Loading
```typescript
// Same API, different implementations
import { ui, components, blocks } from '@ui8kit';

// These components adapt to your chosen mode automatically
<ui.button.Button>Click me</ui.button.Button>
<components.section.Section>Content here</components.section.Section>

// OR Simply
export const { Button } = ui.button;
export const { Card, CardHeader, CardContent, CardFooter, CardImage, CardTitle, CardDescription } = ui.card;
export const { Section, SectionHeader, SectionContent } = components.section;
```

### 🛠️ Development Modes
```bash
# Development with mode switching
bun dev                    # Full switching capability

# Development with fixed mode
bun dev:utility           # Locked to utility classes
bun dev:semantic          # Locked to semantic HTML

# Production builds
bun build:utility         # Build for utility-first approach
bun build:semantic        # Build for semantic approach
```

### 🎨 Perfect for Teams
- **Designers** can work with semantic HTML structure
- **Developers** can use utility-first approach
- **Same components** work for both methodologies
- **No code duplication** between different CSS approaches

---

## Features

- ⚡️ **Vite 6** - Lightning fast build tool
- ⚛️ **React 19** - Latest React with new features
- 🔷 **TypeScript** - Type safety out of the box
- 🚀 **SWC** - Super fast TypeScript/JSX compilation
- 📁 **Path Aliases** - Clean imports with `@/` prefix
- 🎨 **UI8Kit System** - Dual-mode component loading
- 📦 **Minimal Dependencies** - Only what you need

## Quick Start

### Clone current version
```bash
# Clone into new folder
git clone https://github.com/buildy-ui/app-starter.git my-project
cd my-project

# Or clone into current folder (must be empty)
git clone https://github.com/buildy-ui/app-starter.git .
```

### Clone from specific branch version
```bash
# 1) boilerplate - minimal React App Starter
git clone -b boilerplate https://github.com/buildy-ui/app-starter.git my-project
cd my-project

# 2) single-page - minimal React App Starter with Switcher Theme
git clone -b single-page https://github.com/buildy-ui/app-starter.git my-project
cd my-project

# 3) spa-blog - Fully App SPA Blog with UI8KIT_MODE
git clone -b spa-blog https://github.com/buildy-ui/app-starter.git my-project
cd my-project
```

### Install dependencies
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Start development server
```bash
# Development with mode switching
bun dev

# Development with fixed modes
bun dev:utility           # Utility-first mode only
bun dev:semantic          # Semantic HTML mode only
```

Open [http://localhost:5173](http://localhost:5173) to view your app.

## Available Scripts

### Development
- `bun dev` - Start development server with mode switching
- `bun dev:utility` - Start in utility-first mode (fixed)
- `bun dev:semantic` - Start in semantic HTML mode (fixed)

### Production
- `bun build` - Build with mode switching capability
- `bun build:utility` - Build for utility-first approach only
- `bun build:semantic` - Build for semantic HTML approach only
- `bun preview` - Preview production build locally

## UI8Kit System

### Component Structure
```
src/app/ui8kit/
├── loader.tsx              # Dynamic component loader
├── hooks/
│   └── useThemeMode.ts    # Mode switching hook
├── utility/               # Utility-first components
│   ├── ui/               # Base UI components
│   ├── components/       # Semantic components
│   └── blocks/           # Complex blocks
└── semantic/             # Semantic HTML components
    ├── ui/               # Base UI components
    ├── components/       # Semantic components
    └── blocks/           # Complex blocks
```

### Usage Examples
```typescript
// Import the registries
import { ui, components, blocks } from '@ui8kit';

// Use components - they adapt to current mode
function MyPage() {
  return (
    <components.section.Section>
      <ui.card.Card>
        <ui.button.Button>Click me</ui.button.Button>
      </ui.card.Card>
    </components.section.Section>
  );
}

// Mode switching hook
import { useThemeMode } from '@ui8kit/hooks';

function ThemeSwitcher() {
  const { mode, toggleMode, isFixed } = useThemeMode();
  
  if (isFixed) return null; // Hide switcher in fixed mode
  
  return (
    <button onClick={toggleMode}>
      Switch to {mode === 'utility' ? 'semantic' : 'utility'}
    </button>
  );
}
```

## Project Structure

```
├── public/
│   ├── buildy.svg         # Optimized 24x24 icon
│   └── styles.css         # Global styles
├── src/
│   ├── app/
│   │   ├── ui8kit/        # UI8Kit system
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   └── data/          # Static data and context
│   ├── assets/
│   │   ├── css/           # Stylesheets
│   │   └── font/          # Local fonts
│   ├── App.tsx            # Main React component
│   └── main.tsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # Node.js TypeScript config
└── vite.config.ts         # Vite configuration
```

## Environment Variables

### UI8Kit Mode Control
```bash
# Set fixed mode (optional)
VITE_UI8KIT_MODE=utility   # Lock to utility-first
VITE_UI8KIT_MODE=semantic  # Lock to semantic HTML
```

When `VITE_UI8KIT_MODE` is set:
- Mode switching is disabled
- Components load only from the specified mode
- Theme switcher button is hidden
- Optimized bundle size (only one mode included)

## Customization

### Path Aliases
Import from `src/` using the `@/` prefix:
```typescript
import Component from '@/components/Component'
import { ui } from '@ui8kit'
import { renderContext } from '@data'
```

### Adding New Components
1. Create component in both `utility/` and `semantic/` directories
2. Use the same export names in both versions
3. Components automatically work with the loader system

### Styling
- Utility mode: Use Tailwind CSS classes
- Semantic mode: Use semantic CSS classes
- Global styles: `src/assets/css/index.css`

## Other Starter Templates

This repository contains multiple starter templates in different branches:

- `spa-blog` - Single Page Application with blog features (current)
- `boilerplate` - Minimal starter template
- `main` - Documentation and overview
- More templates coming soon...

## License

MIT License - feel free to use this starter for any project.

---

Built with ❤️ by [Buildy UI](https://github.com/buildy-ui)