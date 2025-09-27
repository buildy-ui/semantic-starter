import { Group, Text, Icon } from '@ui8kit/core'
import { Calendar, Tag } from 'lucide-react'

type Meta = {
  date: string
  categories?: { id: number; name: string }[]
}

export function PostMeta({ date, categories }: Meta) {
  return (
    <Group gap="sm" align="center">
      <Group gap="xs" align="center">
        <Icon lucideIcon={Calendar} c="muted" />
        <Text size="sm" c="secondary-foreground">{date}</Text>
      </Group>
      {categories?.length ? (
        <Group gap="xs" align="center">
          <Icon lucideIcon={Tag} c="muted" />
          <Text size="sm" c="secondary-foreground">{categories.map(c => c.name).join(', ')}</Text>
        </Group>
      ) : null}
    </Group>
  )
}


