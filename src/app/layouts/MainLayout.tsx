import { ReactNode } from "react";
import { Helmet } from 'react-helmet-async';
import { Navigation } from "@/app/components/Navigation";
import { Sidebar } from "@/app/components/Sidebar";
import { SiteLogo } from "@/app/components/SiteLogo";
import { renderContext } from '@/data';
export const { site, menu } = renderContext;

import { Main } from '@ui8kit/components/main';
import { P } from '@ui8kit/components/markup';
import { Section, Container, SectionFooter } from '@ui8kit/components/section';
import { SheetLayout, SheetOverlay, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody } from '@ui8kit/components/sheet';
import { NavMobileList, NavMobileItem, NavMobileLink } from '@ui8kit/components/nav';

interface RootLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const MainLayout = ({ title, description, children }: RootLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Helmet>
      
      <SheetLayout>
        <Navigation />

        <Section>
          <Container className="main-layout">
            <Main className="main-content">
              {children}
            </Main>
            <Sidebar className="sidebar" />
          </Container>
        </Section>

        <SectionFooter>
          <Container>
            <P className="text-center-py-4">&copy; {new Date().getFullYear()} {site.title}</P>
            <a href="https://github.com/buildy-ui/ui" className="text-sm text-center-py-4">buildy/ui</a>
          </Container>
        </SectionFooter>

        <SheetOverlay />
        <SheetContent>
          <SheetHeader>
            <SheetTitle><SiteLogo /></SheetTitle>
            <SheetDescription>UI8Kit Design System</SheetDescription>
          </SheetHeader>

          <SheetBody>
            <NavMobileList>
              {menu.primary.items.map((item) => (
                <NavMobileItem key={item.id}>
                  <NavMobileLink href={item.url}>{item.title}</NavMobileLink>
                </NavMobileItem>
              ))}
            </NavMobileList>
          </SheetBody>
        </SheetContent>

      </SheetLayout>
    </>
  );
};
