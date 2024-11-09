import {createFileRoute} from '@tanstack/react-router'
import React from 'react'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  Home,
  Users,
} from 'lucide-react'
import {DatePickerWithRange} from '@/components/date-range-picker'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'

export const Route = createFileRoute('/_layout/')({
  component: DashboardPage,
})
function DashboardPage() {
  const dateRange = {
    from: new Date(),
    to: new Date(),
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your real estate portfolio overview
          </p>
        </div>
        <DatePickerWithRange
          initialDateRange={dateRange}
          onDateChange={(range) => console.log(range)}
        />
      </div>

      <div className="grid gap-6 grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$54,232</div>
            <p className="text-xs text-muted-foreground">
              +19.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +7.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-6 mb-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue breakdown for the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>Based on closed deals this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {topAgents.map((agent) => (
                <div key={agent.name} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>
                      {agent.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {agent.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${agent.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`ml-auto font-medium ${
                      agent.change > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {agent.change > 0 ? '+' : ''}
                    {agent.change}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Types Distribution</CardTitle>
            <CardDescription>
              Breakdown of your property portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyTypes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((source) => (
                <div key={source.name} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{source.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {source.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{width: `${source.percentage}%`}}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-center">
                  <div className="relative mr-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {i !== activities.length - 1 && (
                      <div className="absolute top-2 left-1 w-[1px] h-16 bg-muted" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due {task.dueDate}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Mark Complete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Real estate market trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketInsights.map((insight) => (
                <div
                  key={insight.metric}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{insight.metric}</p>
                    <p className="text-2xl font-bold">{insight.value}</p>
                  </div>
                  <div
                    className={`flex items-center ${
                      insight.trend > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {insight.trend > 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(insight.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const revenueData = [
  {name: 'Jan', revenue: 4000},
  {name: 'Feb', revenue: 4500},
  // ... more months
]

const topAgents = [
  {
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    revenue: 245000,
    change: 12.5,
  },
  // ... more agents
]

const propertyTypes = [
  {type: 'Single Family', count: 45},
  {type: 'Multi Family', count: 28},
  // ... more types
]

const leadSources = [
  {name: 'Website', percentage: 45},
  {name: 'Referrals', percentage: 30},
  // ... more sources
]

const activities = [
  {
    title: 'New Property Listed',
    description: '123 Main St. was added to your listings',
    time: '2 hours ago',
  },
  // ... more activities
]

const tasks = [
  {
    id: 1,
    title: 'Property Viewing',
    description: 'Show 456 Oak Ave to the Smiths',
    dueDate: 'Tomorrow at 2 PM',
  },
  // ... more tasks
]

const marketInsights = [
  {
    metric: 'Avg. Price/Sqft',
    value: '$245',
    trend: 5.2,
  },
  // ... more insights
]
