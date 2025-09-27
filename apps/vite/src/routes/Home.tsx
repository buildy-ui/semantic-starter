import { Block, Container, Stack, Title, Text, Button, Grid, Card, Group, Image } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { HomeLatest } from '@/ui/HomeLatest'
import { renderContext } from '@/data'

export default function Home() {
  const { home } = renderContext
  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <SEO title={home.page.title} description={home.page.excerpt} />
          <Breadcrumbs items={[{ label: 'Home' }]} />
          <Stack gap="md" align="start">
            <Title order={1} size="3xl">{home.page.title}</Title>
            <Text c="secondary-foreground">{home.page.excerpt}</Text>
            <Group gap="sm">
              <Button>Get Started</Button>
              <Button variant="secondary">Learn More</Button>
            </Group>
          </Stack>

          <Grid cols="1-2-3" gap="lg">
            {home.features.map((f) => (
              <Card key={f.id} p="lg" rounded="lg" shadow="sm" bg="card">
                {f.featuredImage?.url && (
                  <Image src={f.featuredImage.url} alt={f.featuredImage.alt} rounded="md" w="full" h="auto" fit="cover" />
                )}
                <Title order={3} size="lg">{f.title}</Title>
                <Text size="sm" c="secondary-foreground">{f.excerpt}</Text>
              </Card>
            ))}
          </Grid>

          <HomeLatest />
        </Stack>
      </Container>
    </Block>
  )
}


