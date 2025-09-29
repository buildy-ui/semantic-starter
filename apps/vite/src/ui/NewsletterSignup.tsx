import { Card, Stack, Title, Text, Button } from '@ui8kit/core'

export function NewsletterSignup() {
  return (
    <Card p="xl" rounded="xl" shadow="md" bg="primary" data-class="newsletter-signup">
      <Stack gap="md">
        <Title order={3} size="xl" fw="bold" c="primary-foreground">Subscribe</Title>
        <Text size="sm" c="primary-foreground" leading="relaxed">Get the latest posts delivered to your inbox.</Text>
        <input 
          type="email" 
          placeholder="you@example.com" 
          data-class="newsletter-input"
          style={{ padding: '12px', borderRadius: '8px', border: 'none', background: 'white' }}
        />
        <Button size="sm" variant="secondary" w="full">Subscribe</Button>
      </Stack>
    </Card>
  )
}


