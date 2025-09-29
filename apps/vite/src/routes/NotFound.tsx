import { Block, Container, Stack, Title, Text } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { SearchBar } from '@/ui/SearchBar'

export default function NotFound() {
  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Not Found' }]} />
          <Stack gap="md">
            <Title order={1} size="2xl">Page not found</Title>
            <Text c="secondary-foreground">Try searching for what you need:</Text>
            <SearchBar />
          </Stack>
        </Stack>
      </Container>
    </Block>
  )
}


