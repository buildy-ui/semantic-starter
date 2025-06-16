import type { WPFastyContext } from '../wpfasty/types';

type PostsCollection = {
  posts: WPFastyContext['archive']['posts'][];
};

export const posts: PostsCollection = {
  posts: [
    {
      title: 'Three WhalY: Core Principles That Change Everything',
      content: 'Stop writing the same components over and over. BuildY UI follows three core principles that eliminate redundancy and maximize performance. Zero Redundant Code means every line serves a purpose - no bloat, no legacy code, no unnecessary abstractions. Zero Database Queries through intelligent caching delivers lightning-fast response times. Perfect PageSpeed Score ensures 100/100 across Performance, Accessibility, Best Practices, and SEO. These aren\'t just buzzwords - they\'re measurable results that save you hours of development time.',
      slug: 'three-whaly-core-principles',
      url: '/posts/three-whaly-core-principles',
      id: 1,
      excerpt: 'Discover the three core principles that eliminate redundant code, database queries, and performance issues in modern web development.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Three core principles visualization'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Three core principles thumbnail'
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
          name: 'Performance',
          url: '/category/performance',
          id: 2,
          slug: 'performance',
          description: 'Performance optimization techniques',
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
      title: 'Multi-Registry Architecture: Build Like LEGO',
      content: 'Imagine building websites like LEGO blocks - snap components together without worrying about styles or data conflicts. BuildY UI\'s multi-registry architecture makes this reality. Start with the utility registry for foundational components, add semantic registry for meaningful HTML structures, then customize with theme registries. Each registry builds on the previous one, ensuring consistency while allowing infinite customization. Run `npx buildy-ui@latest add button card` and watch components install with intelligent dependency resolution. No more copy-pasting components between projects.',
      slug: 'multi-registry-architecture-lego',
      url: '/posts/multi-registry-architecture-lego',
      id: 2,
      excerpt: 'Learn how BuildY UI\'s multi-registry system lets you build websites like LEGO blocks - fast, consistent, and infinitely customizable.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'LEGO blocks representing modular architecture'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'LEGO blocks thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995300:1'
      },
      categories: [
        {
          name: 'CLI Tools',
          url: '/category/cli-tools',
          id: 3,
          slug: 'cli-tools',
          description: 'Command line tools and automation',
          count: 15
        },
        {
          name: 'Component Libraries',
          url: '/category/component-libraries',
          id: 4,
          slug: 'component-libraries',
          description: 'Building and managing component libraries',
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
      title: 'Smart CLI: Intelligence That Actually Works',
      content: 'Tired of CLIs that break when your internet hiccups? BuildY UI CLI includes retry mode, graceful fallbacks, and dependency intelligence that actually understands your project. Registry validation ensures you never install incompatible components. Component validation checks dependencies before installation. Smart search finds components across all categories automatically. Skip existing files to avoid conflicts, or use --force when you need to overwrite. The --retry flag adds enhanced connection logic with automatic retries. When something goes wrong, you get helpful error messages with actual solutions, not cryptic stack traces.',
      slug: 'smart-cli-intelligence-that-works',
      url: '/posts/smart-cli-intelligence-that-works',
      id: 3,
      excerpt: 'Experience a CLI that handles edge cases gracefully with retry logic, dependency validation, and helpful error messages.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Terminal with smart CLI interface'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Terminal thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995400:1'
      },
      categories: [
        {
          name: 'Developer Experience',
          url: '/category/developer-experience',
          id: 5,
          slug: 'developer-experience',
          description: 'Improving developer workflows and tools',
          count: 11
        },
        {
          name: 'CLI Tools',
          url: '/category/cli-tools',
          id: 3,
          slug: 'cli-tools',
          description: 'Command line tools and automation',
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