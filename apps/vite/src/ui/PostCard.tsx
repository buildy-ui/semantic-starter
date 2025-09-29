import { Card, Image, Stack, Title, Text, Group, Badge, Button } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { postPath } from '@/lib/paths'

type Post = {
  id: number
  title: string
  excerpt: string
  slug: string
  thumbnail?: { url: string; alt: string }
  categories?: { id: number; name: string; slug: string }[]
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Card p="xl" rounded="xl" shadow="md" bg="card" data-class="post-card">
      <Stack gap="lg">
        {post.thumbnail?.url && (
          <Link to={postPath(post.slug)}>
            <Image src={post.thumbnail.url} alt={post.thumbnail.alt} rounded="lg" w="full" h="auto" fit="cover" />
          </Link>
        )}
        <Stack gap="md">
          <Link to={postPath(post.slug)}>
            <Title order={3} size="xl" fw="semibold" c="foreground">{post.title}</Title>
          </Link>
          <Text size="sm" c="secondary-foreground" leading="relaxed">{post.excerpt}</Text>
          {post.categories?.length ? (
            <Group gap="xs" align="center">
              {post.categories.slice(0, 2).map(cat => (
                <Badge key={cat.id} variant="secondary" rounded="full" size="sm">{cat.name}</Badge>
              ))}
            </Group>
          ) : null}
          <Link to={postPath(post.slug)}>
            <Button size="sm" variant="secondary">Read more</Button>
          </Link>
        </Stack>
      </Stack>
    </Card>
  )
}


