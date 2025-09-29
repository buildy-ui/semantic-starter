import { useParams, Link } from 'react-router-dom'
import { Block, Container, Stack, Title, Text, Image, Card, Badge, Group, Button, Grid } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { PostMeta } from '@/ui/PostMeta'
import { AuthorBio } from '@/ui/AuthorBio'
import { RelatedPosts } from '@/ui/RelatedPosts'
import { renderContext } from '@/data'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = renderContext
  const post = posts.posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <Block component="main" py="lg">
        <Container size="lg">
          <Stack gap="md">
            <Title order={1} size="2xl">Post Not Found</Title>
            <Text>The post you're looking for doesn't exist.</Text>
            <Link to="/"><Button size="sm">Return to homepage</Button></Link>
          </Stack>
        </Container>
      </Block>
    )
  }

  return (
    <Block component="main" py="lg">
      <Container size="lg">
        <Stack gap="lg">
          <SEO title={post.title} description={post.excerpt} />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]} />
          {post.featuredImage?.url && (
            <Image src={post.featuredImage.url} alt={post.featuredImage.alt} rounded="lg" w="full" h="auto" fit="cover" />
          )}

          <Stack gap="md">
            <Title order={1} size="3xl">{post.title}</Title>
            <PostMeta date={post.date.display} categories={post.categories as any} tags={post.tags as any} />
          </Stack>

          <Card p="lg" rounded="lg" shadow="sm" bg="card">
            <div data-class="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          </Card>

          <Grid cols="1-2" gap="lg">
            <Stack gap="lg">
              {post.categories?.length ? (
                <Group gap="md" align="center">
                  {post.categories.map(cat => (
                    <Badge key={cat.id} variant="secondary" rounded="full">{cat.name}</Badge>
                  ))}
                </Group>
              ) : null}
              <AuthorBio author={{ name: post.author?.name || 'John Doe', slug: post.author?.slug, role: 'Editor', avatar: { url: 'https://i.pravatar.cc/128', alt: 'Author' }, bio: 'Writer and frontend engineer. Passionate about semantic HTML and design systems.' }} />
            </Stack>

            <RelatedPosts currentId={post.id} posts={renderContext.posts.posts as any} />
          </Grid>
        </Stack>
      </Container>
    </Block>
  )
}


