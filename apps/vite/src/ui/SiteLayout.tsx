import { ReactNode, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Block, Container, Group, Stack, Title, Text, Sheet, Button, Icon, useMobile, useTheme, Grid } from '@ui8kit/core'
import { CategoryList } from '@/ui/CategoryList'
import { TagList } from '@/ui/TagList'
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
      <Block component="header" py="md" bg="background" data-class="nav-bar">
        <Container size="lg">
          <Group justify="between" align="center">
            <Group align="center" gap="sm">
              <Link to="/">
                <Title order={2} size="xl">UI8Kit</Title>
              </Link>
              <Text c="secondary-foreground">Design System</Text>
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

              <Button variant="ghost" size="sm" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
                <Icon lucideIcon={isDarkMode ? Sun : Moon} />
              </Button>

              {isMobile && (
                <Sheet id="site-sheet" side="left" title="Menu" showTrigger triggerIcon={Menu}>
                  <Stack gap="xs">
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

      <Block component="main" py="xl">
        <Container size="lg">
          <Grid cols="1-3" gap="xl">
            <Grid.Col span={2}>
              <Stack gap="xl">
                {children}
              </Stack>
            </Grid.Col>
            <Grid.Col span={1}>
              <aside>
                <Stack gap="xl">
                  <CategoryList items={renderContext.categories as any} />
                  <Link to="/categories"><Text size="sm" c="secondary-foreground">View all categories</Text></Link>
                  <TagList items={renderContext.tags as any} />
                  <Link to="/tags"><Text size="sm" c="secondary-foreground">View all tags</Text></Link>
                  <Link to="/authors"><Text size="sm" c="secondary-foreground">View all authors</Text></Link>
                  <RecentPosts />
                </Stack>
              </aside>
            </Grid.Col>
          </Grid>
        </Container>
      </Block>

      <Block component="footer" py="lg">
        <Container size="lg">
          <Text size="sm" ta="center">© 2025 My Site</Text>
        </Container>
      </Block>
    </Block>
  )
}


