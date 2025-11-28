# AGENTS.md

Instructions for AI coding agents working with this codebase.

---

## Project Overview

This is a **UI8Kit** project — an ultra-fast UI system built on:

- **React Strict DOM (RSD)** — < 2KB runtime, cross-platform
- **TWSX** — Tailwind syntax for RSD/StyleX
- **shadcn color tokens** — Semantic design tokens
- **UI8Kit components** — 13 stateless UI components

## Three Rules to Follow

This project uses three Cursor rules in `.cursor/rules/`:

| Rule | File | When Applied |
|------|------|--------------|
| **React Strict DOM** | `react-strict-dom.mdc` | Always |
| **TWSX** | `twsx.mdc` | When creating layouts/blocks |
| **UI8Kit** | `ui8kit.mdc` | When using UI components |

---

## Quick Reference

### 1. Elements — Always Use RSD

```tsx
// ❌ NEVER
<div><span>Text</span></div>

// ✅ ALWAYS
import { html } from 'react-strict-dom';
<html.div><html.span>Text</html.span></html.div>
```

### 2. Styles — Use TWSX or css.create()

```tsx
// ❌ NEVER
<html.div className="flex gap-4" />
<html.div style={{ padding: 16 }} />

// ✅ ALWAYS
import { twsx } from '@/lib/twsx';
<html.div style={twsx('flex gap-4')} />

// OR with css.create()
import { css } from 'react-strict-dom';
const styles = css.create({ container: { padding: 16 } });
<html.div style={styles.container} />
```

### 3. Components — Use UI8Kit

```tsx
// ❌ NEVER create custom buttons/cards
<html.button style={twsx('px-4 py-2 bg-primary')}>Click</html.button>

// ✅ ALWAYS use UI8Kit
import { Button } from '@ui8kit/ui';
<Button variant="primary">Click</Button>
```

### 4. Colors — Use shadcn Tokens

```tsx
// ❌ NEVER hardcode colors
twsx('bg-blue-500')
twsx('text-gray-900')

// ✅ ALWAYS use tokens
twsx('bg-primary')
twsx('text-foreground')
```

---

## File Structure

```
apps/web/src/
├── components/ui/     # UI8Kit components (DO NOT MODIFY unless asked)
├── variants/          # CVA variants (DO NOT MODIFY unless asked)
├── lib/
│   ├── twsx.ts        # TWSX utility (DO NOT MODIFY unless asked)
│   └── utils.ts       # Utilities
├── layouts/           # Page layouts (CREATE with RSD + TWSX)
└── blocks/            # Composite blocks (CREATE with RSD + TWSX)
```

---

## Common Tasks

### Creating a Page Layout

```tsx
// src/layouts/PageLayout.tsx
import { html } from 'react-strict-dom';
import { twsxCreate } from '@/lib/twsx';
import { Container } from '@ui8kit/ui';

const styles = twsxCreate({
  page: 'min-h-screen flex flex-col bg-background',
  header: 'w-full py-4 px-6 border-b border-border',
  main: 'flex-1 py-8',
  footer: 'w-full py-4 px-6 bg-muted mt-auto',
});

export function PageLayout({ children }) {
  return (
    <html.div style={styles.page}>
      <html.header style={styles.header}>
        <Container>Header</Container>
      </html.header>
      <html.main style={styles.main}>
        <Container>{children}</Container>
      </html.main>
      <html.footer style={styles.footer}>
        <Container>Footer</Container>
      </html.footer>
    </html.div>
  );
}
```

### Creating a Block Component

```tsx
// src/blocks/HeroBlock.tsx
import { html } from 'react-strict-dom';
import { twsxCreate } from '@/lib/twsx';
import { Container, Stack, Title, Text, Button } from '@ui8kit/ui';

const styles = twsxCreate({
  hero: 'py-24 px-6',
});

export function HeroBlock({ title, subtitle, ctaText, onCtaClick }) {
  return (
    <html.section style={styles.hero}>
      <Container ta="center">
        <Stack gap="lg" align="center">
          <Title size="5xl">{title}</Title>
          <Text size="xl" c="muted">{subtitle}</Text>
          <Button variant="primary" size="lg" onClick={onCtaClick}>
            {ctaText}
          </Button>
        </Stack>
      </Container>
    </html.section>
  );
}
```

### Creating a Grid Layout

```tsx
// Use TWSX for CSS Grid (not available in UI8Kit)
import { html } from 'react-strict-dom';
import { twsx } from '@/lib/twsx';

<html.div style={twsx('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6')}>
  {items.map(item => (
    <Card key={item.id}>
      <Card.Content>{item.content}</Card.Content>
    </Card>
  ))}
</html.div>
```

---

## Decision Matrix

| Task | Solution |
|------|----------|
| Button, Badge, Card | `import { X } from '@ui8kit/ui'` |
| Page layout | RSD + `twsxCreate()` |
| CSS Grid | `twsx('grid grid-cols-3 gap-4')` |
| Section wrapper | `<html.section style={...}>` |
| Semantic heading | `<Title order={1} size="4xl">` |
| Paragraph text | `<Text size="lg">` |
| Vertical stack | `<Stack gap="lg">` |
| Horizontal group | `<Group gap="md">` |
| Color | shadcn token (`bg-primary`, `text-foreground`) |

---

## What NOT to Do

### ❌ Don't Use className

```tsx
// WRONG
<html.div className="flex gap-4" />
<Button className="mt-4" />
```

### ❌ Don't Use Inline Styles

```tsx
// WRONG
<html.div style={{ padding: 16 }} />
```

### ❌ Don't Hardcode Colors

```tsx
// WRONG
twsx('bg-blue-500 text-white')
```

### ❌ Don't Create Custom Buttons/Cards

```tsx
// WRONG — use UI8Kit instead
<html.button style={twsx('px-4 py-2 rounded bg-primary')}>
```

### ❌ Don't Use Standard React Elements

```tsx
// WRONG
<div><span>Text</span></div>
```

### ❌ Don't Add State to UI8Kit Components

UI8Kit components are stateless. State belongs in parent components or layouts.

---

## Testing Commands

```bash
# Start development server
bun run dev:web

# Build for production
bun run build

# Type check
bun run typecheck
```

---

## Performance Checklist

- [ ] Styles defined at module level with `twsxCreate()`
- [ ] No dynamic class strings (`` `mt-${n}` ``)
- [ ] Using UI8Kit for common elements
- [ ] Colors from shadcn tokens only
- [ ] No `className` or inline `style={{ }}`

---

## Reference Links

- [101 Guide](./docs/101-guide.md) — Complete introduction
- [React Strict DOM](https://github.com/nicksrandall/react-strict-dom) — RSD documentation
- [shadcn/ui](https://ui.shadcn.com/) — Color token reference
- [Tailwind CSS](https://tailwindcss.com/docs) — Class reference for TWSX

