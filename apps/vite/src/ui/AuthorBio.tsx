import { Card, Group, Image, Stack, Title, Text } from '@ui8kit/core'
import { Link } from 'react-router-dom'
import { authorPath } from '@/lib/paths'

type Author = {
  name: string
  role?: string
  avatar?: { url: string; alt: string }
  bio?: string
}

export function AuthorBio({ author }: { author: Author & { slug?: string } }) {
  return (
    <Card p="lg" rounded="lg" shadow="sm" bg="card">
      <Link to={author.slug ? authorPath(author.slug) : '#'}>
        <Group gap="md" align="start">
          {author.avatar?.url && (
            <Image src={author.avatar.url} alt={author.avatar.alt} rounded="full" w={"auto"} h={64} />
          )}
          <Stack gap="xs">
            <Title order={3} size="lg">{author.name}</Title>
            {author.role && <Text size="sm" c="secondary-foreground">{author.role}</Text>}
            {author.bio && <Text size="sm" c="secondary-foreground">{author.bio}</Text>}
          </Stack>
        </Group>
      </Link>
    </Card>
  )
}


