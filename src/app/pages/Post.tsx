import { MainLayout } from '@/app/layouts/MainLayout';
import { components } from '@/app/ui8kit/loader';
import { renderContext } from '@data';
import { useParams } from 'react-router-dom';

export const { posts } = renderContext.posts;

export const { Article, ArticleHeader, ArticleTitle, ArticleMeta, ArticleTime, ArticleContent, ArticleFooter, ArticleFigure, ArticleImage, ArticleFigcaption, ArticleTags, ArticleTag } = components.article;
export const { H1, P } = components.markup;

export const NotFound = {
  title: 'Post Not Found',
  content: 'The post you\'re looking for doesn\'t exist.',
  link: '/',
  linkText: 'Return to homepage'
} as const;

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <MainLayout title={NotFound.title} description={NotFound.content}>
        <Article>
          <ArticleHeader>
            <H1>{NotFound.title}</H1>
          </ArticleHeader>
          <ArticleContent>
            <p>{NotFound.content}</p>
            <a href={NotFound.link}>{NotFound.linkText}</a>
          </ArticleContent>
        </Article>
      </MainLayout>
    )
  }

  return (
    <MainLayout title={post.title} description={post.excerpt}>
      <Article>

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
          <H1>{post.title}</H1>
          <ArticleMeta>
            <ArticleTime>Published on {post.date.display}</ArticleTime>
          </ArticleMeta>
        </ArticleHeader>

        <ArticleContent>
          <P>{post.content}</P>
        </ArticleContent>

        {post.categories && (
          <ArticleFooter>
            <ArticleTags>
              {post.categories.map(category => (
                <ArticleTag key={category.id}>
                  <a href={category.url}>
                    {category.name}
                  </a>
                </ArticleTag>
              ))}
            </ArticleTags>
          </ArticleFooter>
        )}
      </Article>
    </MainLayout>
  )
}