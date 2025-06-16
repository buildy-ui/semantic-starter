import type { AboutData } from '../types';

const urlImage = 'https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop';

export const about: AboutData = {
  page: {
    title: 'Switch Theme Mode',
    excerpt: 'Toggle between Tailwind utilities and semantic HTML classes instantly.',
    content: 'Experience how the same React components work seamlessly... Click to switch theme mode button in the top right corner. And see dev tools source code.',
  },
  features: [
    {
      id: 1,
      title: 'Component Flexibility',
      excerpt: 'Build once, style anywhere. Your components adapt to any CSS methodology without code changes.',
      featuredImage: {
        url: urlImage,
        alt: 'Component Flexibility',
        caption: 'Component Flexibility',
      },
    },
    {
      id: 2,
      title: 'Clean Architecture',
      excerpt: 'Separate logic from presentation. Switch between utility-first and semantic approaches effortlessly.',
      featuredImage: {
        url: urlImage,
        alt: 'Clean Architecture',
        caption: 'Clean Architecture',
      },
    },
    {
      id: 3,
      title: 'Developer Experience',
      excerpt: 'Write components once, deploy everywhere. Perfect for teams with different CSS preferences.',
      featuredImage: {
        url: urlImage,
        alt: 'Developer Experience',
        caption: 'Developer Experience',
      },
    },
  ]
};