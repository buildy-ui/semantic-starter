import { Link } from 'react-router-dom';
import { components, ui } from '@ui8kit';
import { useThemeMode } from '@hooks/useThemeMode'
import { DarkMode } from './DarkMode';
import { SiteLogo } from './SiteLogo';

export const { Nav, NavItem, NavLink, NavList, NavGroupButtons, NavBar } = components.nav;
export const { Button } = ui.button;

export function Navigation() {
  const { mode, toggleMode } = useThemeMode();

  return (

    <NavBar>
    <SiteLogo />
    <Nav>
      <NavList>
        <Link to="/">
          <NavItem>
            <NavLink>Home</NavLink>
          </NavItem>
        </Link>
        <Link to="/about">
          <NavItem>
            <NavLink>About</NavLink>
          </NavItem>
        </Link>
      </NavList>
    </Nav>

    <NavGroupButtons>
      <Button className={`${mode === 'semantic' ? '!bg-teal-500 text-white' : 'bg-primary text-white'}`} variant="default" size="lg" onClick={toggleMode}>
        Switch to {mode === 'utility' ? 'semantic' : 'utility'}
      </Button>
      <DarkMode />
    </NavGroupButtons>
  </NavBar>
  );
} 