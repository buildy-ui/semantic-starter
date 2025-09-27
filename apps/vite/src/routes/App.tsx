import { Outlet } from 'react-router-dom'
import { SiteLayout } from '../ui/SiteLayout'

export default function App() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  )
}


