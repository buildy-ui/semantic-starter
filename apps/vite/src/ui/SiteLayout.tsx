import { ReactNode, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Block, Container, Group, Stack, Title, Text, Sheet, Button, Icon, useMobile, useTheme, Grid } from '@ui8kit/core'
import { SearchBar } from '@/ui/SearchBar'
import { CategoryList } from '@/ui/CategoryList'
import { TagList } from '@/ui/TagList'
import { PopularPosts } from '@/ui/PopularPosts'
import { NewsletterSignup } from '@/ui/NewsletterSignup'
import { RecentPosts } from '@/ui/RecentPosts'
import { Menu, Sun, Moon } from 'lucide-react'
import { renderContext } from '@/data'

export function SiteLayout({ children, sidebar = 'right' as 'left' | 'right' }: { children: ReactNode; sidebar?: 'left' | 'right' }) {
  const isMobile = useMobile()
  const { toggleDarkMode, isDarkMode } = useTheme()
  const { menu } = renderContext

  const closeSheet = useCallback(() => {
    const el = document.getElementById('site-sheet') as HTMLInputElement | null
    if (el) el.checked = false
  }, [])

  return (
    <Block component="div" w="full">
      <Block component="header" py="lg" bg="background" data-class="nav-bar" shadow="sm">
        <Container size="lg">
          <Group justify="between" align="center">
            <Group align="center" gap="sm">
              <Link to="/">
                <Title order={2} size="2xl" fw="bold" c="primary">UI8Kit</Title>
              </Link>
              <Text size="sm" c="secondary-foreground">Design System</Text>
            </Group>

            <Group align="center" gap="xs">
              {!isMobile && (
                <nav>
                  <Group align="center" gap="xs" data-class="nav">
                    {menu.primary.items.map(item => (
                      <NavLink key={item.id} to={item.url}>{item.title}</NavLink>
                    ))}
                  </Group>
                </nav>
              )}

              {!isMobile && <SearchBar />}

              <Button variant="ghost" size="sm" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
                <Icon lucideIcon={isDarkMode ? Sun : Moon} />
              </Button>

              {isMobile && (
                <Sheet id="site-sheet" side="left" title="Menu" showTrigger triggerIcon={Menu}>
                  <Stack gap="xs">
                    <SearchBar />
                    {menu.primary.items.map(item => (
                      <NavLink key={item.id} to={item.url} onClick={closeSheet}>{item.title}</NavLink>
                    ))}
                  </Stack>
                </Sheet>
              )}
            </Group>
          </Group>
        </Container>
      </Block>

      <Block component="main" py="2xl">
        <Container size="lg">
          <Grid cols="1-3" gap="2xl">
            <Grid.Col span={2} data-class="main-content">
              <Stack gap="2xl">
                {children}
              </Stack>
            </Grid.Col>
            <Grid.Col span={1} data-class="sidebar">
              <aside>
                <Stack gap="2xl">
                  <CategoryList items={renderContext.categories as any} />
                  <Link to="/categories"><Text size="sm" c="secondary-foreground">View all categories</Text></Link>
                  <TagList items={renderContext.tags as any} />
                  <Link to="/tags"><Text size="sm" c="secondary-foreground">View all tags</Text></Link>
                  <Link to="/authors"><Text size="sm" c="secondary-foreground">View all authors</Text></Link>
                  <PopularPosts />
                  <NewsletterSignup />
                  <RecentPosts />
                </Stack>
              </aside>
            </Grid.Col>
          </Grid>
        </Container>
      </Block>

      <Block component="footer" py="2xl" bg="muted" data-class="site-footer">
        <Container size="lg">
          <Stack gap="lg" align="center">
            <Text size="sm" c="secondary-foreground" ta="center">© 2025 UI8Kit Design System</Text>
            <Group gap="md" justify="center">
              <Link to="/"><Text size="xs" c="secondary-foreground">Home</Text></Link>
              <Link to="/blog"><Text size="xs" c="secondary-foreground">Blog</Text></Link>
              <Link to="/about"><Text size="xs" c="secondary-foreground">About</Text></Link>
            </Group>
          </Stack>
        </Container>
      </Block>
    </Block>
  )
}


