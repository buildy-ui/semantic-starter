import { MainLayout } from '@/app/layouts/MainLayout';
import { renderContext } from '@/data';
import { Article, ArticleHeader, ArticleContent, ArticleFigure, ArticleImage, ArticleFigcaption, ArticleMeta, ArticleTime, ArticleFooter, ArticleTags, ArticleTag } from '@ui8kit/components/article';
import { H1, P } from '@ui8kit/components/markup';
import { useParams } from 'react-router-dom';

export const { posts } = renderContext.posts;

export const NotFound = {
  title: 'Post Not Found',
  content: 'The post you\'re looking for doesn\'t exist.',
  link: '/',
  linkText: 'Return to homepage'
} as const;

interface PostProps {
  slug?: string; // For static generation
}

export function Post({ slug: propSlug }: PostProps = {}) {
  const params = useParams<{ slug: string }>();
  // Use the slug from props (for static generation) or from useParams (for SPA)
  const slug = propSlug || params.slug;
  
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <MainLayout title={NotFound.title} description={NotFound.content}>
        <Article>
          <ArticleHeader>
            <H1>{NotFound.title}</H1>
          </ArticleHeader>
          <ArticleContent>
            <P>{NotFound.content}</P>
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
            {post.featuredImage.alt && (
              <ArticleFigcaption>{post.featuredImage.alt}</ArticleFigcaption>
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