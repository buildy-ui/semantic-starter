import { Card, Image, Stack, Title, Text, Group, Badge, Button } from '@ui8kit/core'
import { Link } from 'react-router-dom'

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
    <Card p="lg" rounded="lg" shadow="sm" bg="card">
      {post.thumbnail?.url && (
        <Image src={post.thumbnail.url} alt={post.thumbnail.alt} rounded="md" w="full" h="auto" fit="cover" />
      )}
      <Stack gap="sm">
        <Title order={3} size="lg">{post.title}</Title>
        <Text size="sm" c="secondary-foreground">{post.excerpt}</Text>
        {post.categories?.length ? (
          <Group gap="xs" align="center">
            {post.categories.slice(0, 2).map(cat => (
              <Badge key={cat.id} variant="secondary" rounded="full">{cat.name}</Badge>
            ))}
          </Group>
        ) : null}
        <Link to={`/posts/${post.slug}`}>
          <Button size="sm">Read more</Button>
        </Link>
      </Stack>
    </Card>
  )
}


