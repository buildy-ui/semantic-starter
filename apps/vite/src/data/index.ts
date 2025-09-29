import { site, menu } from './wpfasty/context';
import { about } from './pages/about';
import { home } from './pages/home';
import { blog } from './pages/blog';
import { posts as rawPosts } from './posts';

// Normalize and aggregate derived data so counts are consistent
function normalize() {
  const byCat = new Map<string, number>();
  const catMeta = new Map<string, { id: number; name: string; slug: string }>();
  const byTag = new Map<string, number>();
  const tagMeta = new Map<string, { id: number; name: string; slug: string }>();
  const byAuthor = new Map<string, number>();
  const authorMeta = new Map<string, { id: number; name: string; slug: string }>();

  // First pass: collect counts and metadata
  for (const p of rawPosts.posts) {
    for (const c of p.categories || []) {
      byCat.set(c.slug, (byCat.get(c.slug) || 0) + 1);
      if (!catMeta.has(c.slug)) catMeta.set(c.slug, { id: c.id, name: c.name, slug: c.slug });
    }
    for (const t of p.tags || []) {
      byTag.set(t.slug, (byTag.get(t.slug) || 0) + 1);
      if (!tagMeta.has(t.slug)) tagMeta.set(t.slug, { id: t.id, name: t.name, slug: t.slug });
    }
    if (p.author) {
      byAuthor.set(p.author.slug, (byAuthor.get(p.author.slug) || 0) + 1);
      if (!authorMeta.has(p.author.slug)) authorMeta.set(p.author.slug, { id: p.author.id, name: p.author.name, slug: p.author.slug });
    }
  }

  // Second pass: rewrite categories in posts with accurate counts
  const posts = {
    posts: rawPosts.posts.map(p => ({
      ...p,
      categories: (p.categories || []).map(c => ({ ...c, count: byCat.get(c.slug) || 0 })),
      tags: (p.tags || []).map(t => ({ ...t, count: byTag.get(t.slug) || 0 })),
      author: p.author ? { ...p.author, count: byAuthor.get(p.author.slug) || 0 } : undefined
    }))
  } as typeof rawPosts;

  // Aggregated categories list for sidebars/filters
  const categories = Array.from(catMeta.values()).map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: byCat.get(c.slug) || 0,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const tags = Array.from(tagMeta.values()).map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    count: byTag.get(t.slug) || 0,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const authors = Array.from(authorMeta.values()).map(a => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    count: byAuthor.get(a.slug) || 0,
  })).sort((a, b) => a.name.localeCompare(b.name));

  return { posts, categories, tags, authors };
}

const { posts, categories, tags, authors } = normalize();

// Current implementation - static data
export const renderContext = {
  about,
  home,
  blog,
  posts,
  categories,
  tags,
  authors,
  site,
  menu,
} as const;

// Future implementation may include:
// - API calls
// - CMS integration  
// - Caching layer
// - Error handling

export type RenderContextKey = keyof typeof renderContext;