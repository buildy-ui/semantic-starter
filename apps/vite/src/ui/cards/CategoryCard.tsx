import { Card, Stack, Title, Text, Button } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { categoryPath } from '@/lib/paths'

type Category = { id: number; name: string; slug: string; count?: number }

export function CategoryCard({ item }: { item: Category }) {
  return (
    <Card p="lg" rounded="lg" shadow="sm" bg="card">
      <Stack gap="md">
        <Title order={3} size="lg">{item.name}</Title>
        {typeof item.count === 'number' && (
          <Text size="sm" c="secondary-foreground">{item.count} posts</Text>
        )}
        <Link to={categoryPath(item.slug)}>
          <Button size="sm">View posts</Button>
        </Link>
      </Stack>
    </Card>
  )
}


