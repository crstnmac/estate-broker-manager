import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { toast } from 'sonner'

interface LeadNotesProps {
  leadId: number
}

export function LeadNotes({ leadId }: LeadNotesProps) {
  const [note, setNote] = useState('')
  const { update } = useLeads()

  const handleAddNote = async () => {
    if (!note.trim()) return

    try {
      await update({
        id: leadId,
        name: '',
        email: '',
        status: 'new',
        source: '',
        createdAt: '',
        updatedAt: ''
      })
      setNote('')
      toast.success('Note added successfully')
    } catch (error) {
      toast.error('Failed to add note')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button onClick={handleAddNote} disabled={!note.trim()}>
          Add Note
        </Button>
      </div>

      <div className="space-y-4">
        {/* TODO: Implement notes list */}
        <p className="text-sm text-gray-500">No notes yet</p>
      </div>
    </div>
  )
}
