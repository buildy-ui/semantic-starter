import { Outlet } from 'react-router-dom'
import { DashLayout } from '@ui8kit/core'
import {
  useTheme,
  Card,
  Button,
  Badge,
  Stack,
  Grid,
  Text,
  Title,
  Group
} from '@ui8kit/core'

// Sidebar Navigation Component
export const Sidebar = () => {
  const menuItems = [
    { label: 'Dashboard', icon: '📊', active: true },
    { label: 'Users', icon: '👥', active: false },
    { label: 'Products', icon: '📦', active: false },
    { label: 'Orders', icon: '🛒', active: false },
    { label: 'Analytics', icon: '📈', active: false },
    { label: 'Settings', icon: '⚙️', active: false },
  ]

  return (
    <Stack gap="md" p="md">
      <Title order={4} className="mb-4">Admin Panel</Title>
      <Stack gap="sm">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? 'primary' : 'ghost'}
            leftSection={<span>{item.icon}</span>}
            contentAlign="start"
            style={{ width: '100%' }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  )
}

// Dashboard Statistics Cards
const StatsCard = ({ title, value, change, icon, color }: {
  title: string
  value: string
  change: string
  icon: string
  color: 'blue' | 'green' | 'orange' | 'red'
}) => (
  <Card variant="filled" shadow="sm">
    <Card.Content p="md">
      <Group justify="between" align="center">
        <div>
          <Text size="sm" c="muted">{title}</Text>
          <Title order={3} mt="xs">{value}</Title>
          <Badge
            size="xs"
            variant={change.startsWith('+') ? 'success' : 'destructive'}
            style={{ marginTop: '0.25rem' }}
          >
            {change}
          </Badge>
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </Group>
    </Card.Content>
  </Card>
)

// Recent Activity Item
const ActivityItem = ({ title, time, status }: {
  title: string
  time: string
  status: 'success' | 'warning' | 'destructive'
}) => (
  <Group justify="between" align="center" p="sm" style={{ borderBottom: '1px solid var(--color-border)' }}>
    <div>
      <Text size="sm" fw="semibold">{title}</Text>
      <Text size="xs" c="muted">{time}</Text>
    </div>
    <Badge variant={status} size="xs">{status}</Badge>
  </Group>
)

// Dashboard Content
const DashboardContent = () => (
  <Stack gap="lg" p="lg">
    {/* Welcome Header */}
    <div>
      <Title order={2}>Dashboard</Title>
      <Text c="muted">Welcome back! Here's what's happening with your business today.</Text>
    </div>

    {/* Statistics Cards */}
    <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
      <StatsCard
        title="Total Users"
        value="12,345"
        change="+12.5%"
        icon="👥"
        color="blue"
      />
      <StatsCard
        title="Revenue"
        value="$45,678"
        change="+8.2%"
        icon="💰"
        color="green"
      />
      <StatsCard
        title="Orders"
        value="1,234"
        change="+15.3%"
        icon="🛒"
        color="orange"
      />
      <StatsCard
        title="Conversion"
        value="3.24%"
        change="-2.1%"
        icon="📈"
        color="red"
      />
    </Grid>

    {/* Main Content Grid */}
    <Grid cols={{ base: 1, lg: 2 }} gap="lg">
      {/* Recent Activity */}
      <Card shadow="sm">
        <Card.Header>
          <Card.Title order={4}>Recent Activity</Card.Title>
        </Card.Header>
        <Card.Content p="none">
          <ActivityItem
            title="New user registration"
            time="2 minutes ago"
            status="success"
          />
          <ActivityItem
            title="Order #1234 completed"
            time="15 minutes ago"
            status="success"
          />
          <ActivityItem
            title="Payment failed for order #1233"
            time="1 hour ago"
            status="destructive"
          />
          <ActivityItem
            title="New product added to catalog"
            time="2 hours ago"
            status="success"
          />
          <ActivityItem
            title="System maintenance scheduled"
            time="4 hours ago"
            status="warning"
          />
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card shadow="sm">
        <Card.Header>
          <Card.Title order={4}>Quick Actions</Card.Title>
        </Card.Header>
        <Card.Content>
          <Stack gap="sm">
            <Button leftSection="➕" variant="primary" style={{ width: '100%' }}>
              Add New Product
            </Button>
            <Button leftSection="👥" variant="outline" style={{ width: '100%' }}>
              Manage Users
            </Button>
            <Button leftSection="📊" variant="outline" style={{ width: '100%' }}>
              View Reports
            </Button>
            <Button leftSection="⚙️" variant="outline" style={{ width: '100%' }}>
              System Settings
            </Button>
          </Stack>
        </Card.Content>
      </Card>
    </Grid>

    {/* Charts Placeholder */}
    <Card shadow="sm">
      <Card.Header>
        <Card.Title order={4}>Analytics Overview</Card.Title>
      </Card.Header>
      <Card.Content>
        <div style={{
          height: '300px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '500'
        }}>
          📊 Chart Visualization Area
          <br />
          <small style={{ opacity: 0.8 }}>Charts will be integrated here</small>
        </div>
      </Card.Content>
    </Card>
  </Stack>
)

export default function App() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <DashLayout
      navbarProps={{
        isDarkMode,
        toggleDarkMode,
        brand: 'Admin Dashboard'
      }}
      sidebar={<Sidebar />}
    >
      <Outlet /> {/* DashboardContent */}
    </DashLayout>
  )
}
