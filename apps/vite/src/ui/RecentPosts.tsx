import { Stack, Title } from '@ui8kit/core'
import { renderContext } from '@/data'
import { PostCard } from '@/ui/PostCard'

export function RecentPosts() {
  const { posts } = renderContext
  const recent = posts.posts.slice(0, 3)
  return (
    <Stack gap="md">
      <Title order={3} size="lg">Recent Posts</Title>
      <Stack gap="md">
        {recent.map(p => <PostCard key={p.id} post={p as any} />)}
      </Stack>
    </Stack>
  )
}


