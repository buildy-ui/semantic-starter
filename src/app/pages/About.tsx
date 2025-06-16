import { MainLayout } from '@/app/layouts/MainLayout';
import { components, ui } from '@ui8kit';
import { renderContext } from '@data';

export const { page, features } = renderContext.about;
export const { Button } = ui.button;
export const { Main } = ui.main;
export const { Card, CardHeader, CardContent, CardFooter, CardImage, CardTitle, CardDescription } = ui.card;
export const { Section, Grid, SectionHeader, SectionFooter, SectionContent, SectionTitle, SectionDescription } = components.section;

function App() {

  return (
    <MainLayout title={page.title} description={page.excerpt}>
      <Section>
        <SectionHeader>
          <SectionTitle>{page.title}</SectionTitle>
          <SectionDescription>{page.excerpt}</SectionDescription>
        </SectionHeader>
        <SectionContent className="w-full py-12 px-6 bg-muted rounded-md mb-12">
          <p className="py-6 text-secondary-foreground">{page.content}</p>
        </SectionContent>

        <SectionContent>
          <Grid>
            {features.map((feature) => (
              <Card key={feature.id}>
                <CardImage src={feature.featuredImage.url} alt={feature.featuredImage.alt} caption={feature.featuredImage.caption} />
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