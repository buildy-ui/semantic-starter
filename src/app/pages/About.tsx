import { useThemeMode } from '@hooks/useThemeMode'
import { DarkMode } from '../components/DarkMode';
import { Navigation } from '../components/Navigation';
import { components, ui } from '@ui8kit';

export const { Button } = ui.button;
export const { Card, CardHeader, CardContent, CardFooter, CardImage, CardTitle, CardDescription } = ui.card;
export const { Section, Container, Grid, SectionHeader, SectionFooter, SectionContent, SectionTitle, SectionDescription } = components.section;

export const urlImage = 'https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop';

const page = {
  title: 'Switch Theme Mode',
  excerpt: 'Toggle between Tailwind utilities and semantic HTML classes instantly. Same components, different approaches.',
  content: 'Experience how the same React components work seamlessly with both styling approaches. Switch modes to see Tailwind utility classes transform into clean HTML5 semantic markup while maintaining identical functionality and design.',
}

const posts = [
  {
    id: 1,
    title: 'Component Flexibility',
    excerpt: 'Build once, style anywhere. Your components adapt to any CSS methodology without code changes.',
    featuredImage: {
      url: urlImage,
      alt: 'Component Flexibility',
      caption: 'Component Flexibility',
    },
  },
  {
    id: 2,
    title: 'Clean Architecture',
    excerpt: 'Separate logic from presentation. Switch between utility-first and semantic approaches effortlessly.',
    featuredImage: {
      url: urlImage,
      alt: 'Clean Architecture',
      caption: 'Clean Architecture',
    },
  },
  {
    id: 3,
    title: 'Developer Experience',
    excerpt: 'Write components once, deploy everywhere. Perfect for teams with different CSS preferences.',
    featuredImage: {
      url: urlImage,
      alt: 'Developer Experience',
      caption: 'Developer Experience',
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
                    <Button title="See Dev Tools" className={`${mode === 'semantic' ? '!bg-teal-500 text-white' : 'bg-primary text-white'}`} variant="default" size="lg" onClick={toggleMode}>
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
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardImage src={post.featuredImage.url} alt={post.featuredImage.alt} caption={post.featuredImage.caption} />
                  <CardContent>
                    <CardTitle>{post.title}</CardTitle>
                    <p className="text-sm">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end pb-6">
                    <Button variant="secondary" size="lg">Read More</Button>
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
export { App as About }; 