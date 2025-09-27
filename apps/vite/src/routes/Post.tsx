import { useParams, Link } from 'react-router-dom'
import { Block, Container, Stack, Title, Text, Image, Card, Badge, Group, Button } from '@ui8kit/core'
import { renderContext } from '@/data'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const { posts } = renderContext
  const post = posts.posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <Block component="main" py="xl">
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
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          {post.featuredImage?.url && (
            <Image src={post.featuredImage.url} alt={post.featuredImage.alt} rounded="lg" w="full" h="auto" fit="cover" />
          )}

          <Stack gap="xs">
            <Title order={1} size="3xl">{post.title}</Title>
            <Text size="sm" c="secondary-foreground">Published on {post.date.display}</Text>
          </Stack>

          <Card p="lg" rounded="lg" shadow="sm" bg="card">
            <div data-class="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          </Card>

          {post.categories?.length ? (
            <Group gap="sm" align="center">
              {post.categories.map(cat => (
                <Badge key={cat.id} variant="secondary" rounded="full">{cat.name}</Badge>
              ))}
            </Group>
          ) : null}
        </Stack>
      </Container>
    </Block>
  )
}


