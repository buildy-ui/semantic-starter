import { useThemeMode } from '@hooks/useThemeMode'
import { DarkMode } from '../components/DarkMode';
import { Navigation } from '../components/Navigation';
import { components, ui } from '@ui8kit';

export const { Button } = ui.button;
export const { Card, CardHeader, CardContent, CardFooter, CardImage, CardTitle, CardDescription } = ui.card;
export const { Section, Container, Grid, SectionHeader, SectionFooter, SectionContent, SectionTitle, SectionDescription } = components.section;

export const urlImage = 'https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop';

const page = {
  title: 'Welcome to Buildy UI',
  excerpt: 'Modern React component library with theme support and flexible architecture.',
  content: 'Buildy UI provides a set of ready-to-use components that are easily customizable and integrate into any project. Support for dark and light themes, as well as switching between utility-first and semantic styling approaches.',
}

const features = [
  {
    id: 1,
    title: 'Flexible Components',
    excerpt: 'Easily customizable components with support for various styles and themes.',
    featuredImage: {
      url: urlImage,
      alt: 'Flexible Components',
      caption: 'Flexible Components',
    },
  },
  {
    id: 2,
    title: 'TypeScript Support',
    excerpt: 'Full typing for better development experience and code reliability.',
    featuredImage: {
      url: urlImage,
      alt: 'TypeScript Support',
      caption: 'TypeScript Support',
    },
  },
  {
    id: 3,
    title: 'Modern Design',
    excerpt: 'Current design patterns and UI/UX best practices for modern applications.',
    featuredImage: {
      url: urlImage,
      alt: 'Modern Design',
      caption: 'Modern Design',
    },
  },
]

function App() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <>
      <Navigation />
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>{page.title}</SectionTitle>
            <SectionDescription>{page.excerpt}</SectionDescription>
          </SectionHeader>
          <SectionContent className="w-full py-12 px-6 bg-muted rounded-md mb-12">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 sm:col-span-2">
                <p className="py-6 text-secondary-foreground">{page.content}</p>
              </div>
              <Card className="col-span-3 sm:col-span-1" >
                <CardContent className="flex flex-col justify-center items-center py-6">
                  <p className="text-lg pb-6">Current mode: <span className="font-bold">{mode}</span></p>
                  <div className="flex justify-center items-center gap-2">
                    <Button className={`${mode === 'semantic' ? '!bg-teal-500 text-white' : 'bg-primary text-white'}`} variant="default" size="lg" onClick={toggleMode}>
                      Switch to {mode === 'utility' ? 'semantic' : 'utility'}
                    </Button>
                    <DarkMode />
                  </div>
                </CardContent>
              </Card>
            </div>
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
          <SectionFooter className="flex justify-center">
            <a href="https://github.com/buildy-ui/ui" className="text-sm py-4">buildy/ui</a>
          </SectionFooter>
        </Container>
      </Section>
    </>
  );
}

export default App;
export { App as Home }; 