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
import { zodValidator } from '@tanstack/zod-form-adapter'
import { toast } from 'sonner'
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

export const Route = createFileRoute('/_layout/leads/new')({
  component: NewLeadPage,
})

function NewLeadPage() {
  const navigate = useNavigate()
  const { create } = useLeads()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      source: '',
      notes: '',
      status: 'new'
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: leadSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        create({
          ...value,
          createdAt:  new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        toast.success('Lead created successfully')
        navigate({ to: '/leads' })
      } catch (error) {
        toast.error('Failed to create lead')
      }
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Lead</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>

          <form.Field name="status">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={field.state.value} onValueChange={field.handleChange}>
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
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
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>

          <div className="flex gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="w-full" disabled={!canSubmit}>
                  {isSubmitting ? 'Creating...' : 'Create Lead'}
                </Button>
              )}
            </form.Subscribe>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/leads' })}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
