import { components, ui } from '@/app/ui8kit/loader';
import { useThemeMode } from '@hooks/useThemeMode'
import { DarkMode } from './DarkMode';
import { SiteLogo } from './SiteLogo';
import { renderContext } from '@data';

export const { site, menu } = renderContext;

export const { Nav, NavItem, NavLink, NavList, NavGroupButtons, NavBar } = components.nav;
export const { Button } = ui.button;
export const { SheetTrigger } = components.sheet;

const FIXED_MODE = import.meta.env.VITE_UI8KIT_MODE as 'utility' | 'semantic' | undefined;

export function Navigation() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <NavBar>
      <SiteLogo />
      <Nav>
        <NavList>
          {menu.primary.items.map((item) => (
            <NavItem key={item.id}>
              <NavLink href={item.url}>{item.title}</NavLink>
            </NavItem>
          ))}
        </NavList>
      </Nav>

      <NavGroupButtons>
        {FIXED_MODE ? null : (
          <Button className={`${mode === 'semantic' ? '!bg-teal-500 text-white' : 'bg-primary text-white'}`} variant="default" size="sm" onClick={toggleMode}>
            Switch to {mode === 'utility' ? 'semantic' : 'utility'}
          </Button>
        )}
        <DarkMode />
        <SheetTrigger htmlFor="sheet-toggle">
          <span className="latty latty-menu"></span>
        </SheetTrigger>
      </NavGroupButtons>
    </NavBar>
  );
} 