import { Stack, Title } from '@ui8kit/core'
import { SmallMediaCard } from '@/ui/SmallMediaCard'

type Post = { id: number; categories?: { slug: string }[] }

export function RelatedPosts({ currentId, posts }: { currentId: number; posts: Post[] }) {
  const current = posts.find(p => p.id === currentId)
  const tags = new Set(current?.categories?.map(c => c.slug))
  const related = posts.filter(p => p.id !== currentId && p.categories?.some(c => tags.has(c.slug))).slice(0, 3)
  if (!related.length) return null
  return (
    <Stack gap="md">
      <Title order={2} size="xl">Related Posts</Title>
      <Stack gap="md">
        {related.map(p => (
          <SmallMediaCard key={p.id} item={p as any} />
        ))}
      </Stack>
    </Stack>
  )
}


