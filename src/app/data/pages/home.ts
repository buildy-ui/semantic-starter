import type { HomeData } from '../types';

const urlImage = 'https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop';

export const home: HomeData = {
  page: {
  title: 'Welcome to Buildy UI',
  excerpt: 'Modern React component library with theme support and flexible architecture.',
  content: 'Buildy UI provides a set of ready-to-use components that are easily customizable and integrate into any project. Support for dark and light themes, as well as switching between utility-first and semantic styling approaches.',
  },
  features: [
  {
    id: 1,
    title: 'Flexible Components',
    excerpt: 'Easily customizable components with support for various styles and themes.',
    featuredImage: {
      url: urlImage,
      alt: 'Flexible Components',
      caption: 'Flexible Components',
    },
  },
  {
    id: 2,
    title: 'TypeScript Support',
    excerpt: 'Full typing for better development experience and code reliability.',
    featuredImage: {
      url: urlImage,
      alt: 'TypeScript Support',
      caption: 'TypeScript Support',
    },
  },
  {
    id: 3,
    title: 'Modern Design',
    excerpt: 'Current design patterns and UI/UX best practices for modern applications.',
    featuredImage: {
      url: urlImage,
      alt: 'Modern Design',
      caption: 'Modern Design',
    },
  },
  ]
};