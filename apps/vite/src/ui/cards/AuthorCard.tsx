import { Card, Stack, Title, Text, Button, Image, Group } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { authorPath } from '@/lib/paths'

type Author = { id: number; name: string; slug: string; count?: number; avatarUrl?: string }

export function AuthorCard({ item }: { item: Author }) {
  return (
    <Card p="lg" rounded="lg" shadow="sm" bg="card">
      <Group gap="md" align="center">
        {item.avatarUrl && <Image src={item.avatarUrl} alt={item.name} rounded="full" w={"auto"} h={48} />}
        <Stack gap="xs">
          <Title order={3} size="lg">{item.name}</Title>
          {typeof item.count === 'number' && <Text size="sm" c="secondary-foreground">{item.count} posts</Text>}
        </Stack>
      </Group>
      <Link to={authorPath(item.slug)}>
        <Button size="sm" m="mt-2">View posts</Button>
      </Link>
    </Card>
  )
}


