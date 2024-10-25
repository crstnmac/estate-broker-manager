import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Home, DollarSign, Users, Calendar, List, PieChart } from 'lucide-react'

export const Route = createFileRoute('/_layout/')({
  component: Dashboard,
})

function Dashboard() {
  const data = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ]

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <h1 className="text-3xl font-bold mb-8">Broker Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">254</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234,567</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">+5 new this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Property Viewing - 123 Main St</span>
                <span className="text-sm text-muted-foreground">
                  Today, 2:00 PM
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Client Meeting - John Doe</span>
                <span className="text-sm text-muted-foreground">
                  Tomorrow, 10:00 AM
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>Open House - 456 Elm St</span>
                <span className="text-sm text-muted-foreground">
                  Sat, 1:00 PM
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button className="flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule Appointment
        </Button>
        <Button className="flex items-center justify-center gap-2">
          <Home className="h-4 w-4" />
          Add New Listing
        </Button>
        <Button className="flex items-center justify-center gap-2">
          <List className="h-4 w-4" />
          View All Listings
        </Button>
        <Button className="flex items-center justify-center gap-2">
          <PieChart className="h-4 w-4" />
          Generate Reports
        </Button>
      </div>
    </div>
  )
}
