import { Outlet, useLocation } from 'react-router-dom'
import { SiteLayout } from '../ui/SiteLayout'

export default function App() {
  const location = useLocation()
  
  const sidebarConfig: Record<string, 'left' | 'right'> = {
    '/about': 'left',
  }

  const getSidebarPosition = (): 'left' | 'right' => {
    return sidebarConfig[location.pathname] || 'right'
  }

  return (
    <SiteLayout sidebar={getSidebarPosition()}>
      <Outlet />
    </SiteLayout>
  )
}
