import { Block, Container, Stack, Title, Text, Grid, Card, Image, Button } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { renderContext } from '@/data'

export default function Blog() {
  const { blog, posts } = renderContext
  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <Stack gap="md">
            <Title order={1} size="2xl">{blog.page.title}</Title>
            <Text c="secondary">{blog.page.excerpt}</Text>
          </Stack>

          <Grid cols="1-2-3" gap="lg">
            {posts.posts.map((p) => (
              <Card key={p.id} p="lg" rounded="lg" shadow="sm" bg="card">
                {p.thumbnail?.url && (
                  <Image src={p.thumbnail.url} alt={p.thumbnail.alt} rounded="md" w="full" h="auto" fit="cover" />
                )}
                <Stack gap="sm">
                  <Title order={3} size="lg">{p.title}</Title>
                  <Text size="sm" c="secondary">{p.excerpt}</Text>
                  <Link to={`/posts/${p.slug}`}>
                    <Button size="sm">Read more</Button>
                  </Link>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Block>
  )
}


