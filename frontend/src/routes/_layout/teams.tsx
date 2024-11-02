import {createFileRoute} from '@tanstack/react-router'


import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {Plus, Search} from 'lucide-react'

export const Route = createFileRoute('/_layout/teams')({
  component: TeamManagement,
})

function TeamManagement(){
  const agents = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(123) 456-7890',
      sales: 15,
      commission: '$45,000',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(234) 567-8901',
      sales: 12,
      commission: '$36,000',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '(345) 678-9012',
      sales: 18,
      commission: '$54,000',
    },
  ]

  const performanceData = [
    {name: 'John Doe', sales: 15},
    {name: 'Jane Smith', sales: 12},
    {name: 'Bob Johnson', sales: 18},
  ]

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Search agents..." className="w-64" />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Agent
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Agent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>
                      {agent.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{agent.name}</span>
                </div>
              </TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.phone}</TableCell>
              <TableCell>{agent.sales}</TableCell>
              <TableCell>{agent.commission}</TableCell>
              <TableCell>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}