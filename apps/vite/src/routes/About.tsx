import { Block, Container, Stack, Title, Text, Grid, Card, Image } from '@ui8kit/core'
import { renderContext } from '@/data'
import { SEO } from '@/ui/SEO'
import { Breadcrumbs } from '@/ui/Breadcrumbs'

export default function About() {
  const { about } = renderContext
  return (
    <Block component="main" py="lg">
        <Stack gap="lg">
          <SEO title={about.page.title} description={about.page.excerpt} />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />
          <Stack gap="md">
            <Title order={1} size="2xl">{about.page.title}</Title>
            <Text c="secondary-foreground">{about.page.excerpt}</Text>
          </Stack>
          <Grid cols="1-2-3" gap="lg">
            {about.features.map((f) => (
              <Card key={f.id} p="lg" rounded="lg" shadow="sm" bg="card">
                {f.featuredImage?.url && (
                  <Image src={f.featuredImage.url} alt={f.featuredImage.alt} rounded="md" w="full" h="auto" fit="cover" />
                )}
                <Title order={3} size="lg">{f.title}</Title>
                <Text size="sm" c="secondary-foreground">{f.excerpt}</Text>
              </Card>
            ))}
          </Grid>
        </Stack>
    </Block>
  )
}


