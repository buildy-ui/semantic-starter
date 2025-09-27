import { Block, Container, Stack, Title, Text, Grid } from '@ui8kit/core'
import { Breadcrumbs } from '@/ui/Breadcrumbs'
import { SEO } from '@/ui/SEO'
import { PostCard } from '@/ui/PostCard'
import { Pagination } from '@/ui/Pagination'
import { useMemo, useState } from 'react'
import { renderContext } from '@/data'

export default function Blog() {
  const { blog, posts } = renderContext
  const [page, setPage] = useState(1)
  const perPage = 6
  const total = Math.max(1, Math.ceil(posts.posts.length / perPage))
  const pageItems = useMemo(() => posts.posts.slice((page-1)*perPage, page*perPage), [page])
  return (
    <Block component="main" py="xl">
      <Container size="lg">
        <Stack gap="xl">
          <SEO title={blog.page.title} description={blog.page.excerpt} />
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} />
          <Stack gap="md">
            <Title order={1} size="2xl">{blog.page.title}</Title>
            <Text c="secondary-foreground">{blog.page.excerpt}</Text>
          </Stack>

          <Grid cols="1-2-3" gap="lg">
            {pageItems.map((p) => (
              <PostCard key={p.id} post={p as any} />
            ))}
          </Grid>

          <Pagination page={page} total={total} onPrev={() => setPage(p => Math.max(1, p-1))} onNext={() => setPage(p => Math.min(total, p+1))} />
        </Stack>
      </Container>
    </Block>
  )
}


