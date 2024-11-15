import { Lead } from '@/shared/types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLeads, createLead, updateLead, deleteLead } from '@/lib/api'

export function useLeads() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  })

  const createMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
  }
}
