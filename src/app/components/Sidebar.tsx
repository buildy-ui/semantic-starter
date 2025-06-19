import { renderContext } from '@/data';

import { OptimizedImage } from '@/app/components/Image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFigure, CardFigcaption } from '@ui8kit/ui/card';
import { Aside } from '@ui8kit/components/aside';
import { P } from '@ui8kit/components/markup';

export const { site } = renderContext;
export const { features } = renderContext.home;

export const widget = features[0]

export type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {

  return (
    <Aside className={className}>
      <div className="flex flex-col gap-6">
        <Card>
          {widget.featuredImage && (
            <CardFigure>
              <OptimizedImage
                src="programmer-working-in-cozy-office-with-large-windows-palm-plants-mountain-view-premium-computer-setu"
                alt="Clean workspace illustration"
                width={768}
                height={576}
                maxWidth={768}
              />
              {widget.featuredImage.caption && (
                <CardFigcaption>{widget.featuredImage.caption}</CardFigcaption>
              )}
            </CardFigure>
          )}

          <CardContent>
            <CardTitle>{widget.title}</CardTitle>
            <CardDescription>{widget.excerpt}</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sidebar</CardTitle>
          </CardHeader>
          <CardContent>
            <P>Sidebar</P>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <P className="text-center py-4">&copy; {new Date().getFullYear()} {site.title}</P>
          </CardContent>
        </Card>
      </div>
    </Aside>
  );
}
