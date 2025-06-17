import { components, ui } from '@/app/ui8kit/loader';
import { renderContext } from '@data';

import { OptimizedImage } from '@/app/components/Image';

export const { site } = renderContext;
export const { features } = renderContext.home;

export const widget = features[0]

export type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { Aside } = components.aside;
  const { P } = components.markup;
  const { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFigure, CardFigcaption } = ui.card;

  return (
    <Aside className={className}>
      <div className="flex flex-col gap-6">
        <Card>
          {widget.featuredImage && (
            <CardFigure>
              <OptimizedImage
                src="programmer-working-in-cozy-office-with-large-windows-palm-plants-mountain-view-premium-computer-setu"
                alt="Clean workspace illustration"
                width={320}
                height={240}
                maxWidth={320}
                //priority={true}
                aboveFold={true}
                className="aspect-video object-cover rounded-t-md"
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
