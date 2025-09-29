import { Stack, Title, Text, Grid } from '@ui8kit/core'
import { renderContext } from '@/data'
import { PostCard } from '@/ui/PostCard'

export function HomeLatest() {
  const { posts } = renderContext
  const latest = posts.posts.slice(0, 3)
  return (
    <Stack gap="md">
      <Title order={2} size="2xl">Latest Posts</Title>
      <Text c="secondary-foreground">Fresh insights from the blog</Text>
      <Grid cols="1-2-3" gap="lg">
        {latest.map(p => <PostCard key={p.id} post={p as any} />)}
      </Grid>
    </Stack>
  )
}


