import { MainLayout } from '@/app/layouts/MainLayout';
import { components, ui } from '@ui8kit';
import { renderContext } from '@data';

export const { page } = renderContext.blog;
export const { posts } = renderContext.posts;

export const { Section, Grid, SectionHeader, SectionFooter, SectionContent, SectionTitle, SectionDescription } = components.section;
export const { Article, ArticleHeader, ArticleTitle, ArticleMeta, ArticleTime, ArticleContent, ArticleFooter, ArticleFigure, ArticleImage, ArticleFigcaption } = components.article;
export const { Button } = ui.button;
export const { P } = components.markup;

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
                  {post.featuredImage.caption && (
                    <ArticleFigcaption>{post.featuredImage.caption}</ArticleFigcaption>
                  )}
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
