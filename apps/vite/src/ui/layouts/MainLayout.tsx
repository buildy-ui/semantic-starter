import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Block, Container, Group, Stack, Title, Text, Sheet, Button, Icon, useMobile, useTheme, Grid } from '@ui8kit/core'
import { SearchBar } from '@/ui/SearchBar'
import { CategoryList } from '@/ui/CategoryList'
import { TagList } from '@/ui/TagList'
import { PopularPosts } from '@/ui/PopularPosts'
import { NewsletterSignup } from '@/ui/NewsletterSignup'
import { Menu, Sun, Moon } from 'lucide-react'
import { renderContext } from '@/data'

export function MainLayout({ children, sidebar = 'right' as 'left' | 'right' | 'none' }: { children: ReactNode; sidebar?: 'left' | 'right' | 'none' }) {
  const isMobile = useMobile()
  const { toggleDarkMode, isDarkMode } = useTheme()
  const { menu } = renderContext
  const defaultGap = isMobile ? "none" : "lg";
  const navigate = useNavigate()

  return (
    <>
      <Block component="nav" py="xs" bg="background" data-class="nav-bar" borderBottom="1px" borderColor="border" shadow="lg">
        <Container size="lg">
          <Group justify="between" align="center">
            <Group align="center" gap="md">
              <Link to="/">
                <Title order={2} size="2xl" fw="bold" c="primary">UI8Kit</Title>
              </Link>
              <Text size="sm" c="secondary-foreground">Design System</Text>
            </Group>

            <Group align="center" gap="sm">

              {!isMobile && (
                <nav>
                  <Group align="center" gap="sm" data-class="nav">
                    {menu.primary.items.map(item => (
                      <Button onClick={() => navigate(item.url)} key={item.id} variant="ghost" size="sm">
                        {item.title}
                      </Button>
                    ))}
                  </Group>
                </nav>
              )}

              <Button variant="ghost" size="sm" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
                <Icon lucideIcon={isDarkMode ? Sun : Moon} />
              </Button>

              {isMobile && (
                <Sheet id="site-sheet" side="left" title="Menu" showTrigger triggerIcon={Menu}>
                  <Stack gap="sm">
                    <SearchBar />
                    {menu.primary.items.map(item => (
                      <Button key={item.id} variant="ghost" size="sm" onClick={() => navigate(item.url)}>{item.title}</Button>
                    ))}
                  </Stack>
                </Sheet>
              )}
            </Group>
          </Group>
        </Container>
      </Block>

      <Block component="main" py="lg" data-class="main-page">
        <Container size="lg">
          {sidebar === 'none' ? (
            <Stack gap="lg">
              {children}
            </Stack>
          ) : (
            <Grid cols="1-4" gap={defaultGap}>
              <Grid.Col span={3} data-class="main-content" order={sidebar === 'left' ? 2 : 1}>
                <Stack gap="lg">
                  {children}
                </Stack>
              </Grid.Col>
              <Grid.Col span={1} data-class="sidebar" order={sidebar === 'left' ? 1 : 2}>
                <Aside />
              </Grid.Col>
            </Grid>
          )}
        </Container>
      </Block>

      <Block component="footer" py="md" borderTop="1px" borderColor="border" bg="card" data-class="site-footer">
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
    </>
  )
}

const Aside = () => (
  <Block component="aside">
    <Stack gap="lg">
      <SearchBar />
      <CategoryList items={renderContext.categories as any} />
      <Link to="/categories"><Text size="sm" c="secondary-foreground">View all categories</Text></Link>
      <TagList items={renderContext.tags as any} />
      <Link to="/tags"><Text size="sm" c="secondary-foreground">View all tags</Text></Link>
      <Link to="/authors"><Text size="sm" c="secondary-foreground">View all authors</Text></Link>
      <PopularPosts />
      <NewsletterSignup />
    </Stack>
  </Block>

)
