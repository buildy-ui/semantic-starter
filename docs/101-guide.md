# UI8Kit 101 Guide

A complete introduction to building ultra-fast UIs with React Strict DOM, TWSX, shadcn colors, and UI8Kit components.

---

## Table of Contents

1. [The Problem We Solve](#the-problem-we-solve)
2. [Architecture Overview](#architecture-overview)
3. [Layer 1: React Strict DOM (RSD)](#layer-1-react-strict-dom-rsd)
4. [Layer 2: TWSX — Tailwind for RSD](#layer-2-twsx--tailwind-for-rsd)
5. [Layer 3: shadcn Color Tokens](#layer-3-shadcn-color-tokens)
6. [Layer 4: UI8Kit Components](#layer-4-ui8kit-components)
7. [Putting It All Together](#putting-it-all-together)
8. [Decision Tree](#decision-tree)
9. [Common Patterns](#common-patterns)
10. [Performance Tips](#performance-tips)

---

## The Problem We Solve

Traditional React UI development has several issues:

| Problem | Traditional | Our Solution |
|---------|-------------|--------------|
| Large bundles | CSS-in-JS runtime overhead | RSD < 2KB runtime |
| Style conflicts | Global CSS, specificity wars | Atomic CSS, scoped styles |
| Inconsistent APIs | Different patterns per library | Unified component props |
| Cognitive load | Learn multiple systems | Three simple layers |

**Our goal:** Build UIs with **zero overhead** and **maximum clarity**.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                        APPLICATION                              │
│                                                                 │
│   ┌─────────────────┐    ┌──────────────────────────────────┐  │
│   │   UI8Kit        │    │   RSD + TWSX                     │  │
│   │   Components    │    │   Custom Layouts                 │  │
│   │                 │    │                                  │  │
│   │   <Button>      │    │   <html.div style={twsx(...)}>   │  │
│   │   <Card>        │    │   <html.section>                 │  │
│   │   <Stack>       │    │   <html.header>                  │  │
│   └────────┬────────┘    └─────────────┬────────────────────┘  │
│            │                           │                        │
│            └───────────┬───────────────┘                        │
│                        ▼                                        │
│   ┌────────────────────────────────────────────────────────┐   │
│   │              shadcn Color Tokens                        │   │
│   │   --primary, --secondary, --background, --foreground   │   │
│   └────────────────────────────────────────────────────────┘   │
│                        │                                        │
│                        ▼                                        │
│   ┌────────────────────────────────────────────────────────┐   │
│   │              React Strict DOM                           │   │
│   │   html.* elements, css.create(), atomic CSS output     │   │
│   └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: React Strict DOM (RSD)

React Strict DOM is the foundation. It provides:

- **< 2KB runtime** on web
- **Atomic CSS output** (no duplicate styles)
- **Cross-platform** (web + React Native)
- **Type-safe** elements and styles

### Basic Usage

```tsx
import { html, css } from 'react-strict-dom';

// Define styles at module level
const styles = css.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    gap: 8
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

// Use html.* elements with style prop
function MyComponent() {
  return (
    <html.div style={styles.container}>
      <html.h1 style={styles.title}>Hello</html.h1>
    </html.div>
  );
}
```

### Key Rules

1. **Only `html.*` elements** — never `<div>`, always `<html.div>`
2. **Only `css.create()` for styles** — never inline `style={{ }}`
3. **No className** — RSD doesn't use class names

### Pseudo-states

```tsx
const styles = css.create({
  button: {
    backgroundColor: {
      default: 'blue',      // Required!
      ':hover': 'darkblue',
      ':active': 'navy'
    }
  }
});
```

### Media Queries

```tsx
const styles = css.create({
  container: {
    width: {
      default: '100%',
      '@media (min-width: 768px)': 600,
      '@media (min-width: 1024px)': 800
    }
  }
});
```

---

## Layer 2: TWSX — Tailwind for RSD

Writing `css.create()` objects is verbose. TWSX lets you use Tailwind-style class names:

```tsx
import { html } from 'react-strict-dom';
import { twsx } from '@/lib/twsx';

// Instead of this:
const styles = css.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 24
  }
});
<html.div style={styles.container} />

// Write this:
<html.div style={twsx('flex flex-col gap-4 p-6')} />
```

### How It Works

1. **Parse** — Split class string into individual classes
2. **Map** — Convert each class to CSS properties
3. **Cache** — Store result for reuse
4. **Return** — StyleX-compatible object

```
twsx('flex gap-4')
    ↓
{ display: 'flex', gap: 16 }
    ↓
css.create({ root: { display: 'flex', gap: 16 } })
    ↓
Cached and returned
```

### Module-Level Styles (Recommended)

```tsx
import { twsxCreate } from '@/lib/twsx';

// Define once at module level
const styles = twsxCreate({
  container: 'min-h-screen flex flex-col',
  header: 'w-full py-4 px-6 bg-background border-b border-border',
  main: 'flex-1 p-6 max-w-7xl mx-auto w-full',
  footer: 'w-full py-4 px-6 bg-muted mt-auto',
});

// Use in component
function PageLayout({ children }) {
  return (
    <html.div style={styles.container}>
      <html.header style={styles.header}>Header</html.header>
      <html.main style={styles.main}>{children}</html.main>
      <html.footer style={styles.footer}>Footer</html.footer>
    </html.div>
  );
}
```

### Conditional Styles

```tsx
<html.button 
  style={[
    twsx('px-4 py-2 rounded-lg font-medium'),
    isActive && twsx('bg-primary text-primary-foreground'),
    !isActive && twsx('bg-secondary text-secondary-foreground')
  ]}
/>
```

### Available Classes

TWSX supports 900+ Tailwind classes:

- **Layout:** `flex`, `grid`, `block`, `hidden`
- **Flexbox:** `flex-col`, `items-center`, `justify-between`, `gap-4`
- **Spacing:** `p-4`, `px-6`, `m-auto`, `mt-8`
- **Sizing:** `w-full`, `h-screen`, `max-w-7xl`
- **Typography:** `text-xl`, `font-bold`, `text-center`
- **Colors:** `bg-primary`, `text-foreground`, `border-border`
- **Effects:** `shadow-md`, `rounded-lg`, `opacity-50`

---

## Layer 3: shadcn Color Tokens

All colors use semantic tokens from shadcn/ui:

```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 4%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 4%);
  --primary: hsl(211 100% 50%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(210 40% 96%);
  --secondary-foreground: hsl(222 47% 11%);
  --muted: hsl(210 40% 96%);
  --muted-foreground: hsl(215 16% 47%);
  --accent: hsl(210 40% 96%);
  --accent-foreground: hsl(222 47% 11%);
  --destructive: hsl(0 84% 60%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(214 32% 91%);
  --input: hsl(214 32% 91%);
  --ring: hsl(211 100% 50%);
}
```

### Usage in TWSX

```tsx
// Background colors
twsx('bg-background')      // Main background
twsx('bg-primary')         // Primary action color
twsx('bg-secondary')       // Secondary elements
twsx('bg-muted')           // Muted/subtle areas
twsx('bg-card')            // Card backgrounds
twsx('bg-destructive')     // Error/danger states

// Text colors
twsx('text-foreground')    // Main text
twsx('text-muted-foreground') // Secondary text
twsx('text-primary')       // Accent text

// Border colors
twsx('border-border')      // Default borders
twsx('border-input')       // Input borders
```

### Dark Mode

Dark mode is automatic via CSS variables:

```css
.dark {
  --background: hsl(0 0% 7%);
  --foreground: hsl(0 0% 88%);
  /* ... other dark values */
}
```

---

## Layer 4: UI8Kit Components

Pre-built, stateless components for common UI elements.

### Layout Components

```tsx
import { Block, Container, Stack, Group, Box } from '@ui8kit/ui'

// Block — semantic sections
<Block variant="section" py="xl" bg="background">
  content
</Block>

// Container — width-constrained wrapper
<Container size="lg" ta="center">
  content
</Container>

// Stack — vertical flex
<Stack gap="lg" align="center">
  <item />
  <item />
</Stack>

// Group — horizontal flex
<Group gap="md" justify="between">
  <item />
  <item />
</Group>

// Box — universal container
<Box p="md" bg="card" rounded="lg" shadow="sm">
  content
</Box>
```

### Typography

```tsx
import { Title, Text } from '@ui8kit/ui'

<Title order={1} size="4xl" fw="bold">Heading</Title>
<Text size="lg" c="muted">Paragraph text</Text>
```

### Interactive

```tsx
import { Button, Badge } from '@ui8kit/ui'

<Button variant="primary" size="md" rounded="lg">
  Click me
</Button>

<Badge variant="success" dot>
  Online
</Badge>
```

### Media

```tsx
import { Image, Icon } from '@ui8kit/ui'
import { Settings } from 'lucide-react'

<Image src="/photo.jpg" aspect="video" rounded="lg" />
<Icon lucideIcon={Settings} size="md" c="muted" />
```

### Composite

```tsx
import { Card } from '@ui8kit/ui'

<Card variant="default" shadow="sm">
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>
    Content here
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

## Putting It All Together

### Example: Landing Page

```tsx
import { html } from 'react-strict-dom';
import { twsx, twsxCreate } from '@/lib/twsx';
import { Container, Stack, Title, Text, Button } from '@ui8kit/ui';

// RSD layout styles
const layout = twsxCreate({
  page: 'min-h-screen flex flex-col bg-background',
  hero: 'py-24 px-6',
  features: 'py-16 px-6 bg-muted',
  grid: 'grid grid-cols-1 md:grid-cols-3 gap-8',
});

function LandingPage() {
  return (
    <html.div style={layout.page}>
      {/* Hero Section — UI8Kit components */}
      <html.section style={layout.hero}>
        <Container ta="center">
          <Stack gap="lg" align="center">
            <Title size="5xl">Build Faster</Title>
            <Text size="xl" c="muted">
              Ultra-fast UI system for modern web apps
            </Text>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Stack>
        </Container>
      </html.section>

      {/* Features Section — RSD + TWSX grid */}
      <html.section style={layout.features}>
        <Container>
          <html.div style={layout.grid}>
            <FeatureCard title="Fast" description="< 2KB runtime" />
            <FeatureCard title="Simple" description="13 components" />
            <FeatureCard title="Flexible" description="Tailwind syntax" />
          </html.div>
        </Container>
      </html.section>
    </html.div>
  );
}
```

---

## Decision Tree

```
Need to build UI?
│
├─ Is it a common element (button, card, badge)?
│  └─ YES → Use UI8Kit component
│
├─ Is it a page layout or custom section?
│  └─ YES → Use RSD + TWSX
│
├─ Need CSS Grid?
│  └─ YES → Use twsx('grid grid-cols-3 gap-4')
│
├─ Need custom styling?
│  └─ YES → Use css.create() directly
│
└─ Need a color?
   └─ Always use shadcn tokens (bg-primary, text-foreground)
```

---

## Common Patterns

### Page Layout

```tsx
const layout = twsxCreate({
  page: 'min-h-screen flex flex-col',
  header: 'w-full py-4 px-6 bg-background border-b border-border',
  main: 'flex-1',
  footer: 'w-full py-4 px-6 bg-muted',
});

function PageLayout({ children }) {
  return (
    <html.div style={layout.page}>
      <html.header style={layout.header}>
        <Container>Header content</Container>
      </html.header>
      <html.main style={layout.main}>{children}</html.main>
      <html.footer style={layout.footer}>
        <Container>Footer content</Container>
      </html.footer>
    </html.div>
  );
}
```

### Responsive Grid

```tsx
// 1 column mobile, 2 tablet, 3 desktop
<html.div style={twsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6')}>
  {items.map(item => <Card key={item.id} {...item} />)}
</html.div>
```

### Centered Content

```tsx
<html.div style={twsx('min-h-screen flex items-center justify-center')}>
  <Container ta="center">
    <Stack gap="lg" align="center">
      {/* content */}
    </Stack>
  </Container>
</html.div>
```

---

## Performance Tips

### 1. Define Styles at Module Level

```tsx
// ✅ Good — cached once
const styles = twsxCreate({
  card: 'bg-card rounded-lg p-6 shadow-sm',
});

// ❌ Bad — recreated every render
function Card() {
  return <html.div style={twsx('bg-card rounded-lg p-6 shadow-sm')} />;
}
```

### 2. Use Static Class Strings

```tsx
// ✅ Good — static string
twsx('mt-4')

// ❌ Bad — dynamic string (can't be cached efficiently)
twsx(`mt-${spacing}`)
```

### 3. Minimize Style Arrays

```tsx
// ✅ Good — simple composition
style={[styles.base, isActive && styles.active]}

// ❌ Bad — too many conditions
style={[
  styles.base,
  isActive && styles.active,
  isDisabled && styles.disabled,
  isHovered && styles.hovered,
  isFocused && styles.focused,
]}
```

### 4. Use UI8Kit for Common Elements

UI8Kit components are pre-optimized. Don't recreate buttons, cards, etc.

---

## Summary

| Layer | Purpose | When to Use |
|-------|---------|-------------|
| **RSD** | Foundation | Always (html.* elements) |
| **TWSX** | Styling | Custom layouts, grids |
| **shadcn** | Colors | All color values |
| **UI8Kit** | Components | Common UI elements |

**Result:** Ultra-fast, maintainable, consistent UIs with minimal code.

