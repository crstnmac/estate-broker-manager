import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {createFileRoute} from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const Route = createFileRoute('/_layout/reports')({
  component: FinancialReports,
})

function FinancialReports() {
 const salesData = [
    { month: 'Jan', sales: 65000 },
    { month: 'Feb', sales: 59000 },
    { month: 'Mar', sales: 80000 },
    { month: 'Apr', sales: 81000 },
    { month: 'May', sales: 56000 },
    { month: 'Jun', sales: 55000 },
  ];

  const topProperties = [
    { id: 1, address: '123 Main St', price: '$450,000', daysOnMarket: 15 },
    { id: 2, address: '456 Elm St', price: '$350,000', daysOnMarket: 22 },
    { id: 3, address: '789 Oak Ave', price: '$550,000', daysOnMarket: 8 },
  ];

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="flex justify-between items-center mb-6">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Report</SelectItem>
            <SelectItem value="listings">Listings Report</SelectItem>
            <SelectItem value="agents">Agent Performance Report</SelectItem>
            <SelectItem value="financial">Financial Report</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                activeDot={{r: 8}}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Days on Market</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    {property.address}
                  </TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell>{property.daysOnMarket}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
};