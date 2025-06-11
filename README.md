# Buildy UI App Starter

A minimal Vite + React + TypeScript starter template for rapid development.

## Features

- ⚡️ **Vite 6** - Lightning fast build tool
- ⚛️ **React 19** - Latest React with new features
- 🔷 **TypeScript** - Type safety out of the box
- 🚀 **SWC** - Super fast TypeScript/JSX compilation
- 📁 **Path Aliases** - Clean imports with `@/` prefix
- 🎨 **Basic CSS** - Minimal styling included
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
# boilerplate - minimal React App Starter
git clone -b boilerplate https://github.com/buildy-ui/app-starter.git my-project
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
# Using Bun
bun dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view your app.

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build locally

## Project Structure

```
├── public/
│   ├── buildy.svg      # Optimized 24x24 icon
│   └── styles.css      # Global styles
├── src/
│   ├── App.tsx         # Main React component
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tsconfig.node.json  # Node.js TypeScript config
└── vite.config.ts      # Vite configuration
```

## Customization

### Path Aliases
Import from `src/` using the `@/` prefix:
```typescript
import Component from '@/components/Component'
```

### Styling
- Global styles are in `public/styles.css`
- Component styles can be added as CSS modules or your preferred solution

### Icon
Replace `public/buildy.svg` with your own 24x24 icon.

## Other Starter Templates

This repository contains multiple starter templates in different branches:

- `boilerplate` - This minimal starter (current)
- `main` - Documentation and overview
- More templates coming soon...

## License

MIT License - feel free to use this starter for any project.

---

Built with ❤️ by [Buildy UI](https://github.com/buildy-ui)