import { Stack, Title, Text } from '@ui8kit/core'
import { Link } from 'react-router-dom'

type Tag = { id: number; name: string; slug: string; count?: number }

export function TagList({ items }: { items: Tag[] }) {
  return (
    <Stack gap="sm">
      <Title order={3} size="lg">Tags</Title>
      <Stack gap="xs">
        {items.map(t => (
          <Link key={t.id} to={`/tag/${t.slug}`}>
            <Text size="sm" c="secondary-foreground">{t.name}{typeof t.count === 'number' ? ` (${t.count})` : ''}</Text>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}


