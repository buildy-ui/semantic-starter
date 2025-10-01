import { Block, Stack, Title, Text, Button, Grid, Card, Group, Image } from '@ui8kit/core'
import { SEO } from '@/ui/SEO'
import { HomeLatest } from '@/ui/HomeLatest'
import { renderContext } from '@/data'

export default function Home() {
  const { home } = renderContext
  return (
    <Block component="main" py="lg">
      <SEO title={home.page.title} description={home.page.excerpt} />

      <Stack gap="2xl" py="lg" data-class="hero-section">
        <Stack gap="md" align="center" ta="center">
          <Title order={1} size="4xl" fw="bold" c="foreground">{home.page.title}</Title>
          <Text size="lg" c="secondary-foreground" leading="relaxed">{home.page.excerpt}</Text>
        </Stack>
        <Group gap="md" justify="center">
          <Button size="lg" variant="default">Get Started</Button>
          <Button size="lg" variant="secondary">Learn More</Button>
        </Group>
      </Stack>

      <Stack gap="lg">
        <Stack gap="lg">
          <Title order={2} size="3xl" fw="bold">Features Posts</Title>
          <Text size="md" c="secondary-foreground">Discover what makes our approach unique</Text>
        </Stack>
        <Grid cols="1-2-3" gap="lg">
          {home.features.map((f) => (
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

        <HomeLatest />
      </Stack>
    </Block>
  )
}


