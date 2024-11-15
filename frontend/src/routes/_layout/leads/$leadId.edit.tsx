import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useLeads } from '@/hooks/useLeads'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { createTimelineEvent } from '@/lib/api'
import { zodValidator } from '@tanstack/zod-form-adapter'
import FieldInfo from '@/components/utils/fieldInfo'

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  source: z.string().min(1, 'Source is required'),
  notes: z.string().optional(),
})

type LeadFormType = z.infer<typeof leadSchema>

export const Route = createFileRoute('/_layout/leads/$leadId/edit')({
  component: EditLeadPage,
})

function EditLeadPage() {
  const { leadId } = Route.useParams()
  const navigate = useNavigate()
  const { data: lead, isLoading, update } = useLeads()

  const form = useForm({
    defaultValues: lead,
    validatorAdapter: zodValidator(),
    validators: {
      onChange: leadSchema,
    },
    onSubmit: async ({ value }) => {
      try {
         await update({
          id: parseInt(leadId),
          name: value.name,
          email: value.email,
          phone: value.phone,
          status: value.status,
          source: value.source,
          notes: value.notes,
          createdAt: lead?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

        await createTimelineEvent({
          leadId: parseInt(leadId),
          type: 'status_change',
          description: `Lead updated by ${value.name}`,
        })

        toast.success('Lead updated successfully')
        navigate({ to: '/leads' })

      } catch (error) {
        toast.error('Failed to update lead')
      }
    },

  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!lead) {
    return <div>Lead not found</div>
  }

  const onSubmit = async (data: LeadFormType) => {

  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Lead: {lead.name}</h1>
        <form

          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-6">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={field.name}
                    onChange={field.handleChange}
                  />
                  <FieldInfo field={field} />

                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={field.name}
                    onChange={field.handleChange}
                  />
                  <FieldInfo field={field} />

                </div>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    value={field.name || ''}
                    onChange={field.handleChange}
                  />
                  <FieldInfo field={field} />

                </div>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={field.name} onValueChange={field.handleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldInfo field={field} />

                </div>
              )}
            </form.Field>

            <form.Field name="source">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={field.name}
                    onChange={field.handleChange}
                  />
                  <FieldInfo field={field} />

                </div>
              )}
            </form.Field>

            <form.Field name="notes">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={field.name || ''}
                    onChange={field.handleChange}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={form.state.isSubmitting}
                className="w-full"
              >
                {form.state.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate({ to: '/leads/$leadId', params: { leadId } })
                }
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
