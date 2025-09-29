import { Block, Container, Stack, Title, Text, Grid } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { renderContext } from '@/data'
import { AuthorCard } from '@/ui/cards/AuthorCard'

export default function Authors() {
  const { authors } = renderContext
  const items = authors.map(a => ({ ...a, avatarUrl: 'https://i.pravatar.cc/96' }))
  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <SEO title="Authors" description="Browse all authors." />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Authors' }]} />
          <Stack gap="sm">
            <Title order={1} size="2xl">Authors</Title>
            <Text c="secondary-foreground">Browse all authors.</Text>
          </Stack>
          <Grid cols="1-2-3" gap="lg">
            {items.map(a => <AuthorCard key={a.id} item={a as any} />)}
          </Grid>
        </Stack>
      </Container>
    </Block>
  )
}


