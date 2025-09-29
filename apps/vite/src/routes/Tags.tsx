import { Block, Container, Stack, Title, Text, Grid } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { renderContext } from '@/data'
import { TagCard } from '@/ui/cards/TagCard'

export default function Tags() {
  const { tags } = renderContext
  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <SEO title="Tags" description="Browse all tags." />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Tags' }]} />
          <Stack gap="sm">
            <Title order={1} size="2xl">Tags</Title>
            <Text c="secondary-foreground">Browse all tags.</Text>
          </Stack>
          <Grid cols="1-2-3" gap="lg">
            {tags.map(t => <TagCard key={t.id} item={t as any} />)}
          </Grid>
        </Stack>
      </Container>
    </Block>
  )
}


