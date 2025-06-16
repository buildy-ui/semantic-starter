import { components, ui } from '@ui8kit';
import { renderContext } from '@data';

export const { site } = renderContext;
export const { features } = renderContext.home;

export const widget = features[0]

export type SidebarProps = {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const { Aside } = components.aside;
  const { P } = components.markup;
  const { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFigure, CardImage, CardFigcaption } = ui.card;

  return (
    <Aside className={className}>
      <div className="flex flex-col gap-6">
        <Card>
          {widget.featuredImage && (
            <CardFigure>
              <CardImage
                src={widget.featuredImage.url}
                alt={widget.featuredImage.alt}
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
