import { Button } from '@/components/ui/button'
import { Calendar, Mail, Phone } from 'lucide-react'
import { useLeads } from '@/hooks/useLeads'
import { toast } from 'sonner'

interface LeadActionsProps {
  leadId: number
}

export function LeadActions({ leadId }: LeadActionsProps) {
  const { update } = useLeads()

  const handleContact = async (type: 'email' | 'phone') => {
    try {
      await update({
        id: leadId,
        lastContact: new Date(),
        name: '',
        email: '',
        status: 'new',
        source: '',
        createdAt: '',
        updatedAt: ''
      })
      toast.success(`Marked as contacted via ${type}`)
    } catch (error) {
      toast.error('Failed to update contact status')
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => handleContact('email')}
      >
        <Mail className="mr-2 h-4 w-4" />
        Send Email
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => handleContact('phone')}
      >
        <Phone className="mr-2 h-4 w-4" />
        Call Lead
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Calendar className="mr-2 h-4 w-4" />
        Schedule Meeting
      </Button>
    </div>
  )
}
