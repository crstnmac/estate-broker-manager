import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '../../../components/leads/data-table'
import { columns } from '../../../components/leads/columns'
import { useLeads } from '@/hooks/useLeads'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/leads/')({
  component: LeadsPage,
})

function LeadsPage() {
  const navigate = useNavigate()
  const { data: leads, isLoading } = useLeads()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads Management</h1>
        <Button onClick={() => navigate({ to: '/leads/new' })}>
          <Plus className="mr-2 h-4 w-4" /> Add New Lead
        </Button>
      </div>
      <DataTable columns={columns} data={leads || []} />
    </div>
  )
}
