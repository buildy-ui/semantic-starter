import { ReactNode, useCallback } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Block, Container, Group, Stack, Title, Text, Sheet, Button, Icon, useMobile, useTheme } from '@ui8kit/core'
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
          <Group align="start" gap="xl" wrap="wrap">
            {sidebar === 'left' && (
              <Stack gap="md" w="full">
                <Title order={3} size="lg">Sidebar</Title>
                <Text size="sm" c="secondary-foreground">Sidebar content</Text>
              </Stack>
            )}

            <Stack gap="xl" w="full">
              {children}
            </Stack>

            {sidebar === 'right' && (
              <Stack gap="md" w="full">
                <Title order={3} size="lg">Sidebar</Title>
                <Text size="sm" c="secondary-foreground">Sidebar content</Text>
              </Stack>
            )}
          </Group>
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


