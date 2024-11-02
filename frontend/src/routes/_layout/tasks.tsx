import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/tasks')({
  component: TaskManagement,
})

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Checkbox} from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Plus, Search} from 'lucide-react'

function TaskManagement() {
  const tasks = [
    {
      id: 1,
      title: 'Follow up with John Doe',
      status: 'In Progress',
      dueDate: '2023-10-20',
      priority: 'High',
    },
    {
      id: 2,
      title: 'Prepare listing presentation for 123 Main St',
      status: 'Not Started',
      dueDate: '2023-10-22',
      priority: 'Medium',
    },
    {
      id: 3,
      title: 'Schedule home inspection for 456 Elm St',
      status: 'Completed',
      dueDate: '2023-10-18',
      priority: 'Low',
    },
  ]

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input type="text" placeholder="Search tasks..." className="w-64" />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="notStarted">Not Started</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="dueDate">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Checkbox id={`task-${task.id}`} />
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Due: {task.dueDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.status}
                </span>
                <Button variant="ghost">Edit</Button>
                <Button variant="ghost">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
