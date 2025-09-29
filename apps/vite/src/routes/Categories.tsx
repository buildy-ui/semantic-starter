import { Block, Container, Stack, Title, Text, Grid } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { renderContext } from '@/data'
import { CategoryCard } from '@/ui/cards/CategoryCard'

export default function Categories() {
  const { categories } = renderContext
  return (
    <Block component="main" py="lg">
      <Container size="lg">
        <Stack gap="lg">
          <SEO title="Categories" description="Browse all categories." />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
          <Stack gap="md">
            <Title order={1} size="2xl">Categories</Title>
            <Text c="secondary-foreground">Browse all categories.</Text>
          </Stack>
          <Grid cols="1-2-3" gap="lg">
            {categories.map(c => <CategoryCard key={c.id} item={c as any} />)}
          </Grid>
        </Stack>
      </Container>
    </Block>
  )
}


