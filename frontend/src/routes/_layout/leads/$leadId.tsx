import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLeads } from '@/hooks/useLeads'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LeadNotes } from '../../../components/leads/lead-notes'
import { LeadTimeline } from '../../../components/leads/lead-timeline'
import { LeadActions } from '../../../components/leads/lead-actions'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Pencil, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export const Route = createFileRoute('/_layout/leads/$leadId')({
  component: LeadDetailsPage,
})

function LeadDetailsPage() {
  const { leadId } = Route.useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading, delete: deleteLead } = useLeads()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!lead) {
    return <div>Lead not found</div>
  }

  const handleDelete = async () => {
    try {
      await deleteLead(parseInt(leadId))
      toast.success('Lead deleted successfully')
      navigate({ to: '/leads' })
    } catch (error) {
      toast.error('Failed to delete lead')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <div className="flex gap-2 mt-2">
            <Badge>{lead.status}</Badge>
            <Badge variant="outline">{lead.source}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              navigate({ to: '/leads/$leadId/edit', params: { leadId } })
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  lead and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="timeline">
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <LeadTimeline leadId={parseInt(leadId)} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <LeadNotes leadId={parseInt(leadId)} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd>{lead.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd>{lead.phone || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Contact</dt>
                  <dd>
                    {lead.lastContact
                      ? format(new Date(lead.lastContact), 'PPP')
                      : 'Never'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadActions leadId={parseInt(leadId)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
