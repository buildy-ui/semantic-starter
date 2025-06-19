import { MainLayout } from '@/app/layouts/MainLayout';
import { renderContext } from '@/data';
import { Button } from '@ui8kit/ui/button';
import { Grid, SectionHeader, SectionContent, SectionTitle, SectionDescription } from '@ui8kit/components/section';
import { Article, ArticleHeader, ArticleTitle, ArticleMeta, ArticleTime, ArticleContent, ArticleFooter, ArticleFigure, ArticleImage, ArticleFigcaption } from '@ui8kit/components/article';
import { P } from '@ui8kit/components/markup';

export const { page } = renderContext.blog;
export const { posts } = renderContext.posts;

export function Blog() {
  return (

    <MainLayout
      title={page.title}
      description={page.excerpt}
    >
      <SectionHeader>
        <SectionTitle>{page.title}</SectionTitle>
        <SectionDescription>{page.excerpt}</SectionDescription>
      </SectionHeader>

      <SectionContent>
        <Grid>
          {posts.map((post) => (
            <Article key={post.id}>

              {post.featuredImage && (
                <ArticleFigure>
                  <ArticleImage
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt}
                  />
                  <ArticleFigcaption>{post.featuredImage.alt}</ArticleFigcaption>
                </ArticleFigure>
              )}
              <ArticleHeader>
                <ArticleTitle>
                  <a href={`/post/${post.slug}`}>
                    {post.title}
                  </a>
                </ArticleTitle>
                <ArticleMeta>
                  <ArticleTime>
                    {post.date.display}
                  </ArticleTime>
                </ArticleMeta>
              </ArticleHeader>
              <ArticleContent className="py-0 text-sm text-secondary-foreground">
                <P>
                  {post.excerpt}
                </P>
              </ArticleContent>
              <ArticleFooter>
                <a href={`/post/${post.slug}`}>
                  <Button variant="secondary" size="sm">Read more</Button>
                </a>
              </ArticleFooter>
            </Article>
          ))}
        </Grid>
      </SectionContent>
    </MainLayout>
  )
}
