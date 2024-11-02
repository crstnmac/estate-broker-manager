import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export const Route = createFileRoute('/_layout/calendar')({
  component: CalendarAppointments,
})

function CalendarAppointments(){
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentDate = new Date()
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )

  const appointments = [
    {
      id: 1,
      date: new Date(2023, 9, 15),
      title: 'Property Viewing',
      client: 'John Doe',
    },
    {
      id: 2,
      date: new Date(2023, 9, 18),
      title: 'Contract Signing',
      client: 'Jane Smith',
    },
    {
      id: 3,
      date: new Date(2023, 9, 22),
      title: 'Open House',
      client: 'Multiple',
    },
  ]

  return (
    <div className="p-8 min-h-screen rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <Button variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {Array.from({length: firstDayOfMonth.getDay()}).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 border rounded-md"></div>
        ))}
        {Array.from({length: lastDayOfMonth.getDate()}).map((_, index) => {
          const date = index + 1
          const appointmentsForDay = appointments.filter(
            (a) => a.date.getDate() === date
          )
          return (
            <Card key={date} className="h-24 overflow-hidden">
              <CardContent className="p-2">
                <div className="font-semibold mb-1">{date}</div>
                {appointmentsForDay.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="text-xs truncate bg-blue-100 p-1 mb-1 rounded"
                  >
                    {appointment.title}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}