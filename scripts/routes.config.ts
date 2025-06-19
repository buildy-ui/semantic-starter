import { Home } from '../src/app/pages/Home';
import { About } from '../src/app/pages/About';
import { Blog } from '../src/app/pages/Blog';
import { Post } from '../src/app/pages/Post';

export type RouteInfo = {
  path: string;
  component: React.ComponentType<any>;
  paramMapper?: (params: Record<string, string>) => any;
};

export const routeConfig: RouteInfo[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/blog",
    component: Blog,
  },
  {
    path: "/post/:slug",
    component: Post,
    paramMapper: (params: Record<string, string>) => ({ slug: params.slug })
  },
];

