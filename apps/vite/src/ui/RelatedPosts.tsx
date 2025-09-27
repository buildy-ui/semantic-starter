import { Stack, Title, Group } from '@ui8kit/core'
import { PostCard } from '@/ui/PostCard'

type Post = { id: number; categories?: { slug: string }[] }

export function RelatedPosts({ currentId, posts }: { currentId: number; posts: Post[] }) {
  const current = posts.find(p => p.id === currentId)
  const tags = new Set(current?.categories?.map(c => c.slug))
  const related = posts.filter(p => p.id !== currentId && p.categories?.some(c => tags.has(c.slug))).slice(0, 3)
  if (!related.length) return null
  return (
    <Stack gap="md">
      <Title order={2} size="xl">Related Posts</Title>
      <Group gap="lg">
        {related.map(p => (
          <PostCard key={p.id} post={p as any} />
        ))}
      </Group>
    </Stack>
  )
}


