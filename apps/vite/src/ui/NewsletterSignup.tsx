import { Card, Stack, Title, Text, Button } from '@ui8kit/core'

export function NewsletterSignup() {
  return (
    <Card p="lg" rounded="lg" shadow="sm" bg="card">
      <Stack gap="sm">
        <Title order={3} size="lg">Subscribe</Title>
        <Text size="sm" c="secondary-foreground">Get the latest posts delivered to your inbox.</Text>
        <input type="email" placeholder="you@example.com" data-class="newsletter-input" />
        <Button size="sm">Subscribe</Button>
      </Stack>
    </Card>
  )
}


