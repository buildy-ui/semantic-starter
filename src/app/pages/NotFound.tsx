import { MainLayout } from '@/app/layouts/MainLayout';
import { components } from '@/app/ui8kit/loader';

export const { Article, ArticleHeader, ArticleTitle, ArticleMeta, ArticleTime, ArticleContent, ArticleFooter, ArticleFigure, ArticleImage, ArticleFigcaption, ArticleTags, ArticleTag } = components.article;
export const { H1, P } = components.markup;

export const NotFoundPage = {
  title: 'Page Not Found',
  content: 'The page you are looking for does not exist.',
  link: '/',
  linkText: 'Return to homepage'
} as const;


export function NotFound() {
  return (
      <MainLayout title={NotFoundPage.title} description={NotFoundPage.content}>
        <Article>
          <ArticleHeader>
            <H1>{NotFoundPage.title}</H1>
          </ArticleHeader>
          <ArticleContent>
            <p>{NotFoundPage.content}</p>
            <a href={NotFoundPage.link}>{NotFoundPage.linkText}</a>
          </ArticleContent>
        </Article>
      </MainLayout>
  )
}
