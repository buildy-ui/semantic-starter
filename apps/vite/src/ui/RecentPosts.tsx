import { Stack, Title, Text, Grid } from '@ui8kit/core'
import { renderContext } from '@/data'
import { PostCard } from '@/ui/PostCard'

export function RecentPosts() {
  const { posts } = renderContext
  const recent = posts.posts.slice(0, 3)
  return (

    <Stack gap="md">
      <Title order={2} size="2xl">Recent Posts</Title>
      <Text c="secondary-foreground">Fresh insights from the blog</Text>
      <Grid cols="1-2-3" gap="lg">
        {recent.map(p => <PostCard key={p.id} post={p as any} />)}
      </Grid>
    </Stack>
  )
}


