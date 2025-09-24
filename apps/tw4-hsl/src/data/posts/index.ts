import type { WPFastyContext } from '../wpfasty/types';

type PostsCollection = {
  posts: WPFastyContext['archive']['posts'][];
};

export const posts: PostsCollection = {
  posts: [
    {
      title: 'Three Pillars of Modern Frontend Architecture',
      content: 'The future of scalable frontend development rests on three fundamental pillars that transform how we build web applications. **Semantic HTML5 Foundation** ensures accessibility, SEO optimization, and future-proof markup that follows W3C standards. Every component generates clean, semantic HTML5 elements with meaningful class names that screen readers, search engines, and developers can understand instantly. **Component-Driven Architecture** leverages atomic design principles with TypeScript-first development, creating reusable, testable components that scale across enterprise applications. **Utility-to-Semantic Transformation** bridges the gap between rapid prototyping with Tailwind CSS and production-ready semantic classes, delivering the best of both worlds: developer experience and maintainable code.',
      slug: 'three-pillars-modern-frontend-architecture',
      url: '/posts/three-pillars-modern-frontend-architecture',
      id: 1,
      excerpt: 'Discover the three foundational pillars that define modern frontend architecture: semantic HTML5, component-driven development, and utility-to-semantic transformation.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Three pillars of modern frontend architecture visualization'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Three pillars architecture thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995200:1'
      },
      categories: [
        {
          name: 'Architecture',
          url: '/category/architecture',
          id: 1,
          slug: 'architecture',
          description: 'Posts about software architecture and design patterns',
          count: 8
        },
        {
          name: 'Semantic HTML',
          url: '/category/semantic-html',
          id: 2,
          slug: 'semantic-html',
          description: 'HTML5 semantics and accessibility best practices',
          count: 12
        }
      ],
      date: {
        formatted: '2024-01-15T10:30:00Z',
        display: 'January 15, 2024',
        modified: '2024-01-16T14:20:00Z',
        modified_display: 'January 16, 2024',
        timestamp: 1705315800,
        year: '2024',
        month: '01',
        day: '15'
      }
    },
    {
      title: 'Clean Code Principles for Semantic HTML5 Components',
      content: 'Writing clean, maintainable frontend code starts with semantic HTML5 foundations and extends through every layer of your component architecture. **Meaningful Markup** means every HTML element serves a semantic purpose - using `<article>`, `<section>`, `<nav>`, and `<aside>` elements correctly improves accessibility scores and SEO rankings. **BEM-Inspired Class Naming** creates self-documenting CSS that follows `.block__element--modifier` conventions, making your stylesheets readable and maintainable. **Component Composition** over inheritance ensures your React components remain testable, reusable, and easy to debug. **TypeScript Integration** provides compile-time safety with proper prop validation and IntelliSense support. Clean code isn\'t just about aesthetics - it\'s about building systems that scale, perform, and remain maintainable as your team grows.',
      slug: 'clean-code-principles-semantic-html5-components',
      url: '/posts/clean-code-principles-semantic-html5-components',
      id: 2,
      excerpt: 'Learn how to write clean, maintainable frontend code using semantic HTML5 elements, BEM methodology, and component composition patterns.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Clean code principles and semantic HTML5 structure'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Clean code principles thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995300:1'
      },
      categories: [
        {
          name: 'Clean Code',
          url: '/category/clean-code',
          id: 3,
          slug: 'clean-code',
          description: 'Clean code principles and best practices',
          count: 15
        },
        {
          name: 'Component Design',
          url: '/category/component-design',
          id: 4,
          slug: 'component-design',
          description: 'Component architecture and design patterns',
          count: 9
        }
      ],
      date: {
        formatted: '2024-01-20T15:45:00Z',
        display: 'January 20, 2024',
        modified: '2024-01-21T09:30:00Z',
        modified_display: 'January 21, 2024',
        timestamp: 1705748700,
        year: '2024',
        month: '01',
        day: '20'
      }
    },
    {
      title: 'From Tailwind Utilities to Production-Ready Semantic Classes',
      content: 'The journey from utility-first development to semantic HTML5 production code represents a paradigm shift in modern frontend workflows. **Development Velocity** with Tailwind CSS enables rapid prototyping using utility classes like `flex items-center justify-between`, while **Automated Extraction** transforms these utilities into semantic classes like `.header-navigation` and `.button-primary`. **Class Variance Authority (CVA)** patterns provide the bridge between utility chaos and semantic clarity, generating type-safe component variants that compile to clean CSS. **Production Optimization** results in smaller bundle sizes, improved Core Web Vitals scores, and better accessibility compliance. **Framework-Agnostic Output** means your semantic HTML5 and CSS work perfectly in React, Vue, Angular, or vanilla JavaScript environments. This approach eliminates the traditional trade-off between developer experience and code quality - you get both.',
      slug: 'tailwind-utilities-production-semantic-classes',
      url: '/posts/tailwind-utilities-production-semantic-classes',
      id: 3,
      excerpt: 'Transform Tailwind utility classes into production-ready semantic HTML5 with automated extraction, CVA patterns, and framework-agnostic output.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Tailwind CSS transformation to semantic HTML5 classes'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Tailwind transformation thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995400:1'
      },
      categories: [
        {
          name: 'Tailwind CSS',
          url: '/category/tailwind-css',
          id: 5,
          slug: 'tailwind-css',
          description: 'Tailwind CSS techniques and optimization',
          count: 11
        },
        {
          name: 'Semantic HTML',
          url: '/category/semantic-html',
          id: 2,
          slug: 'semantic-html',
          description: 'HTML5 semantics and accessibility best practices',
          count: 15
        }
      ],
      date: {
        formatted: '2024-01-25T12:15:00Z',
        display: 'January 25, 2024',
        modified: '2024-01-25T16:30:00Z',
        modified_display: 'January 25, 2024',
        timestamp: 1706184900,
        year: '2024',
        month: '01',
        day: '25'
      }
    }
  ]
};