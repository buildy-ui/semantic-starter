import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, skyOSTheme } from '@ui8kit/core'
import App from '@/routes/App'
import Home from '@/routes/Home'
import About from '@/routes/About'
import Blog from '@/routes/Blog'
import Post from '@/routes/Post'
import Category from '@/routes/Category'
import './assets/css/index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'blog', element: <Blog /> },
      { path: 'category/:slug', element: <Category /> },
      { path: 'posts/:slug', element: <Post /> },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={skyOSTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
