import { useQuery } from '@tanstack/react-query'
import { getTimelineEvents } from '@/lib/api'
import { TimelineEvent } from '@/shared/types'
import { cn } from '@/lib/utils'
import {
  CalendarIcon,
  MessageSquareIcon,
  PhoneIcon,
  FileIcon,
  RefreshCwIcon,
} from 'lucide-react'

interface LeadTimelineProps {
  leadId: number
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'meeting_scheduled':
      return CalendarIcon
    case 'note_added':
      return MessageSquareIcon
    case 'contact':
      return PhoneIcon
    case 'document_added':
      return FileIcon
    case 'status_change':
      return RefreshCwIcon
    default:
      return MessageSquareIcon
  }
}

export function LeadTimeline({ leadId }: LeadTimelineProps) {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['timeline', leadId],
    queryFn: () => getTimelineEvents(leadId),
  })

  if (isLoading) {
    return <div>Loading timeline...</div>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const Icon = getEventIcon(event.type)
        return (
          <div key={event.id} className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {new Date(event.createdAt).toLocaleString()}
              </p>
              <p className="mt-1">{event.description}</p>
              {event.metadata && (
                <pre className="mt-2 p-2 bg-muted rounded-md text-sm">
                  {JSON.stringify(event.metadata, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )
      })}
      {events.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No timeline events yet
        </p>
      )}
    </div>
  )
}
