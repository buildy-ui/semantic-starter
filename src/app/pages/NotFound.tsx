import { MainLayout } from '@/app/layouts/MainLayout';
import { Article, ArticleHeader, ArticleContent } from '@ui8kit/components/article';
import { H1, P } from '@ui8kit/components/markup';

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
            <P>{NotFoundPage.content}</P>
            <a href={NotFoundPage.link}>{NotFoundPage.linkText}</a>
          </ArticleContent>
        </Article>
      </MainLayout>
  )
}
