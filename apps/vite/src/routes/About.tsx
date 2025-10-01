import { Block, Stack, Title, Text, Grid, Card, Image } from '@ui8kit/core'
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
        <Stack gap="lg">
          <Stack gap="lg">
            <Title order={2} size="3xl" fw="bold">{about.page.title}</Title>
            <Text size="md" c="secondary-foreground">{about.page.excerpt}</Text>
          </Stack>
          <Grid cols="1-2-3" gap="lg">
            {about.features.map((f) => (
              <Card key={f.id} p="lg" rounded="xl" shadow="md" bg="card">
                <Stack gap="lg">
                  {f.featuredImage?.url && (
                    <Image src={f.featuredImage.url} alt={f.featuredImage.alt} rounded="lg" w="full" h="auto" fit="cover" />
                  )}
                  <Stack gap="md">
                    <Title order={3} size="xl" fw="semibold">{f.title}</Title>
                    <Text size="sm" c="secondary-foreground" leading="relaxed">{f.excerpt}</Text>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Block>
  )
}


