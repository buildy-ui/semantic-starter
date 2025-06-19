import { DarkMode } from '@/app/components/DarkMode';
import { SiteLogo } from '@/app/components/SiteLogo';
import { renderContext } from '@/data';

export const { site, menu } = renderContext;

import { Nav, NavItem, NavLink, NavList, NavGroupButtons, NavBar } from '@ui8kit/components/nav';
import { SheetTrigger } from '@ui8kit/components/sheet';

export function Navigation() {

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
        <DarkMode />
        <SheetTrigger>
          <span className="latty latty-menu"></span>
        </SheetTrigger>
      </NavGroupButtons>
    </NavBar>
  );
} 