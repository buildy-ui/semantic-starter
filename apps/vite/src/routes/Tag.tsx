import { useParams, Link } from 'react-router-dom'
import { Block, Container, Stack, Title, Text, Grid, Button } from '@ui8kit/core'
import { renderContext } from '@/data'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { PostCard } from '@/ui/PostCard'
import { SEO } from '@/ui/SEO'

export default function Tag() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = renderContext
  const filtered = posts.posts.filter(p => p.tags?.some(t => t.slug === slug))
  const tagName = filtered[0]?.tags?.find(t => t.slug === slug)?.name || 'Tag'

  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <SEO title={`Tag: ${tagName}`} description={`Posts tagged with ${tagName}.`} />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: tagName }]} />
          <Stack gap="sm">
            <Title order={1} size="2xl">Tag: {tagName}</Title>
            <Text c="secondary-foreground">Posts tagged with “{tagName}”.</Text>
          </Stack>
          {filtered.length === 0 ? (
            <Stack gap="sm">
              <Text>No posts found for this tag.</Text>
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


