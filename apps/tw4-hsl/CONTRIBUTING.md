# Contributing to Frontend Component Library

Thank you for your interest in contributing to our project! This guide will help you understand our development process and how to contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Building Semantic Classes from Tailwind](#building-semantic-classes-from-tailwind)
- [Component Development Guidelines](#component-development-guidelines)
- [Submitting Changes](#submitting-changes)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please treat all contributors with respect and create a welcoming environment for everyone.

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/buildy-starter.git
   cd buildy-starter
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/buildy-starter.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Run tests:
   ```bash
   bun run test
   ```

4. Check code formatting:
   ```bash
   bun run lint
   ```

## Architecture Overview

Our component library follows a **utility-to-semantic** conversion pattern, combining the speed of Tailwind CSS development with the clarity of semantic HTML output.

### Key Principles

1. **Atomic Design**: Components are built as atoms, molecules, and organisms
2. **Semantic-First Output**: Clean, semantic class names in production
3. **Centralized Design Tokens**: Single source of truth for styling
4. **Framework Agnostic**: Output works in any environment

### Directory Structure

```
src/
├── app/
│   ├── components/          # Shared components
│   ├── ui8kit/             # Component library
│   │   ├── semantic/       # Semantic component variants
│   │   └── utility/        # Utility-based components
│   └── pages/              # Application pages
├── assets/
│   ├── css/                # Compiled CSS
│   └── images/             # Static assets
└── data/                   # Application data
```

## Building Semantic Classes from Tailwind

### Core Concept

We use **Class Variance Authority (CVA)** to define component variants with Tailwind utilities, then extract them into semantic CSS classes.

### Step-by-Step Process

#### 1. Define Component with CVA

```tsx
// src/app/ui8kit/utility/components/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base classes
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### 2. Create Semantic Variant

```tsx
// src/app/ui8kit/semantic/components/button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const baseClass = 'btn';
    const variantClass = variant !== 'primary' ? `btn-${variant}` : '';
    const sizeClass = size !== 'default' ? `btn-${size}` : '';
    
    return (
      <button
        className={cn(baseClass, variantClass, sizeClass, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### 3. Generate Semantic CSS

Create corresponding CSS file:

```css
/* src/assets/css/semantic/button.css */
.btn {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
  @apply disabled:pointer-events-none disabled:opacity-50;
  @apply h-10 px-4 py-2; /* default size */
  @apply bg-primary text-primary-foreground hover:bg-primary/90; /* default variant */
}

.btn-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80;
}

.btn-destructive {
  @apply bg-destructive text-destructive-foreground hover:bg-destructive/90;
}

.btn-outline {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground;
}

.btn-ghost {
  @apply hover:bg-accent hover:text-accent-foreground;
  @apply bg-transparent;
}

.btn-link {
  @apply text-primary underline-offset-4 hover:underline;
  @apply bg-transparent px-0;
}

.btn-sm {
  @apply h-9 rounded-md px-3;
}

.btn-lg {
  @apply h-11 rounded-md px-8;
}

.btn-icon {
  @apply h-10 w-10 px-0;
}
```

### Naming Conventions

#### Semantic Class Structure
```
[component]-[variant]-[size]-[state]
```

Examples:
- `btn` (base button)
- `btn-primary` (primary variant)
- `btn-lg` (large size)
- `btn-outline-sm` (outline variant, small size)

#### Component File Naming
- Utility components: `src/app/ui8kit/utility/components/[component].tsx`
- Semantic components: `src/app/ui8kit/semantic/components/[component].tsx`
- CSS files: `src/assets/css/semantic/[component].css`

### Extraction Process

1. **Development**: Use utility classes with CVA for rapid prototyping
2. **Analysis**: Identify common patterns and variants
3. **Semantic Mapping**: Create semantic class names following BEM-like conventions
4. **CSS Generation**: Extract Tailwind utilities into semantic CSS classes
5. **Component Creation**: Build semantic React components using the new classes

## Component Development Guidelines

### Creating New Components

1. **Start with Utility Version**:
   ```tsx
   // Define with Tailwind utilities and CVA
   const componentVariants = cva(/* ... */);
   ```

2. **Define Semantic Classes**:
   ```css
   .component-base { /* base styles */ }
   .component-variant { /* variant styles */ }
   ```

3. **Create Semantic Component**:
   ```tsx
   // Use semantic class names
   <div className="component component-variant" />
   ```

4. **Document Usage**:
   ```tsx
   /**
    * Component description
    * @param variant - Available variants: primary, secondary
    * @param size - Available sizes: sm, default, lg
    */
   ```

### Design Tokens

All design tokens are centralized in `src/app/ui8kit/buildy.config.json`:

```json
{
  "colors": {
    "primary": "hsl(var(--primary))",
    "secondary": "hsl(var(--secondary))"
  },
  "spacing": {
    "xs": "0.5rem",
    "sm": "1rem"
  },
  "typography": {
    "fontFamily": {
      "sans": ["Nunito", "sans-serif"]
    }
  }
}
```

### Testing Requirements

- Unit tests for all components
- Accessibility tests (a11y)
- Visual regression tests
- Cross-browser compatibility

## Submitting Changes

### Branch Naming

- `feature/component-name` - New components
- `fix/issue-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(button): add semantic button component
fix(card): resolve accessibility issues
docs(contributing): update development setup
```

### Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/new-component
   ```

2. **Make Changes**: Follow the development guidelines above

3. **Test Your Changes**:
   ```bash
   bun run test
   bun run lint
   bun run build
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat(component): add new semantic component"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/new-component
   ```

6. **Fill PR Template**: Include description, testing notes, and screenshots

### PR Requirements

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Semantic CSS generated
- [ ] Accessibility tested
- [ ] Cross-browser tested

## Code Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Peer Review**: At least one team member reviews code
3. **Design Review**: UI/UX team reviews visual changes
4. **Accessibility Review**: Ensure WCAG compliance
5. **Approval**: Maintainer approves and merges

## Release Process

1. **Version Bump**: Follow semantic versioning
2. **Changelog**: Update CHANGELOG.md
3. **Build**: Generate production assets
4. **Tag**: Create Git tag
5. **Publish**: Deploy to npm/CDN

## Getting Help

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server
- **Email**: Contact maintainers directly

## Recognition

Contributors are recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- Annual contributor highlights

Thank you for contributing to our project! 🚀