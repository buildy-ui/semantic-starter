import { Group, Image, Stack, Title, Text } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { postPath } from '@/lib/paths'

type Item = {
  id: number
  title: string
  slug: string
  excerpt?: string
  thumbnail?: { url: string; alt: string }
}

export function SmallMediaCard({ item }: { item: Item }) {
  return (
    <Group gap="md" align="start">
      {item.thumbnail?.url && (
        <Link to={postPath(item.slug)}>
          <Image src={item.thumbnail.url} alt={item.title} rounded="md" w={64} h={64} fit="cover" />
        </Link>
      )}
      <Stack gap="xs">
        <Link to={postPath(item.slug)}><Title order={4} size="md">{item.title}</Title></Link>
        {item.excerpt && <Text size="xs" c="secondary-foreground">{item.excerpt}</Text>}
      </Stack>
    </Group>
  )
}


