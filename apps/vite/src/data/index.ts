import { site, menu } from './wpfasty/context';
import { about } from './pages/about';
import { home } from './pages/home';
import { blog } from './pages/blog';
import { posts } from './posts';

// Current implementation - static data
export const renderContext = {
  about,
  home,
  blog,
  posts,
  site,
  menu,
} as const;

// Future implementation may include:
// - API calls
// - CMS integration  
// - Caching layer
// - Error handling

export type RenderContextKey = keyof typeof renderContext;