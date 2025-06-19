import { MainLayout } from '@/app/layouts/MainLayout';
import { renderContext } from '@/data';
import { Button } from '@ui8kit/ui/button';
import { Card, CardContent, CardFooter, CardImage, CardFigure, CardFigcaption, CardTitle } from '@ui8kit/ui/card';
import { Section, Grid, SectionHeader, SectionContent, SectionTitle, SectionDescription } from '@ui8kit/components/section';

export const { page, features } = renderContext.about;  

function App() {

  return (
    <MainLayout title={page.title} description={page.excerpt}>
      <Section>
        <SectionHeader>
          <SectionTitle>{page.title}</SectionTitle>
          <SectionDescription>{page.excerpt}</SectionDescription>
        </SectionHeader>
        <SectionContent className="section-content__muted">
          <p className="text-secondary-foreground">{page.content}</p>
        </SectionContent>

        <SectionContent>
          <Grid>
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardFigure>
                  <CardImage src={feature.featuredImage.url} alt={feature.featuredImage.alt} />
                  <CardFigcaption>{feature.featuredImage.caption}</CardFigcaption>
                </CardFigure>
                <CardContent>
                  <CardTitle>{feature.title}</CardTitle>
                  <p className="text-sm">{feature.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-end pb-6">
                  <Button variant="secondary" size="lg">Learn More</Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </SectionContent>
      </Section>
    </MainLayout>
  );
}

export default App;
export { App as About }; 