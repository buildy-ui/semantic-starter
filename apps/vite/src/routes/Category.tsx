import { useParams, Link } from 'react-router-dom'
import { Block, Container, Stack, Title, Text, Grid, Button } from '@ui8kit/core'
import { renderContext } from '@/data'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { PostCard } from '@/ui/PostCard'
import { SEO } from '@/ui/SEO'

export default function Category() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = renderContext
  const filtered = posts.posts.filter(p => p.categories?.some(c => c.slug === slug))
  const categoryName = filtered[0]?.categories?.find(c => c.slug === slug)?.name || 'Category'

  return (
    <Block component="main" py="lg">
      <Stack gap="lg">
        <SEO title={`Category: ${categoryName}`} description={`Posts categorized under ${categoryName}.`} />
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: categoryName }]} />
        <Stack gap="md">
          <Title order={1} size="2xl">{categoryName}</Title>
          <Text c="secondary-foreground">Posts categorized under “{categoryName}”.</Text>
        </Stack>
        {filtered.length === 0 ? (
          <Stack gap="md">
            <Text>No posts found in this category.</Text>
            <Link to="/blog"><Button size="sm">Back to blog</Button></Link>
          </Stack>
        ) : (
          <Grid cols="1-2-3" gap="lg">
            {filtered.map(p => <PostCard key={p.id} post={p as any} />)}
          </Grid>
        )}
      </Stack>
    </Block>
  )
}


