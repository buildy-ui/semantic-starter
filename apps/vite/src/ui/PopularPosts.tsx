import { Stack, Title } from '@ui8kit/core'
import { renderContext } from '@/data'
import { SmallMediaCard } from '@/ui/SmallMediaCard'

export function PopularPosts() {
  const { posts } = renderContext
  const popular = posts.posts.slice(0, 5)
  return (
    <Stack gap="md">
      <Title order={3} size="lg">Popular Posts</Title>
      <Stack gap="lg">
        {popular.map(p => <SmallMediaCard key={p.id} item={p as any} />)}
      </Stack>
    </Stack>
  )
}


