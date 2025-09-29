import { useParams, Link } from 'react-router-dom'
import { Block, Container, Stack, Title, Text, Grid, Button } from '@ui8kit/core'
import { renderContext } from '@/data'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { PostCard } from '@/ui/PostCard'
import { SEO } from '@/ui/SEO'

export default function Author() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = renderContext
  const filtered = posts.posts.filter(p => p.author?.slug === slug)
  const authorName = filtered[0]?.author?.name || 'Author'

  return (
    <Block component="main" py="lg">
      <Container size="lg">
        <Stack gap="lg">
          <SEO title={`Author: ${authorName}`} description={`Posts written by ${authorName}.`} />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: authorName }]} />
          <Stack gap="md">
            <Title order={1} size="2xl">Author: {authorName}</Title>
            <Text c="secondary-foreground">Posts written by {authorName}.</Text>
          </Stack>
          {filtered.length === 0 ? (
            <Stack gap="md">
              <Text>No posts found for this author.</Text>
              <Link to="/blog"><Button size="sm">Back to blog</Button></Link>
            </Stack>
          ) : (
            <Grid cols="1-2-3" gap="lg">
              {filtered.map(p => <PostCard key={p.id} post={p as any} />)}
            </Grid>
          )}
        </Stack>
      </Container>
    </Block>
  )
}


