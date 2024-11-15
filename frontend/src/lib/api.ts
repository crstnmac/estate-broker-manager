import type { ApiRoutes, ErrorResponse, SuccessResponse, Lead } from '@/shared/types'
import { queryOptions } from '@tanstack/react-query'
import { hc } from 'hono/client'

const client = hc<ApiRoutes>('/', {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
}).api

export const postSignup = async (
  password: string,
  email: string,
  name: string
) => {
  try {
    const res = await client.auth.signup.$post({
      form: {
        password,
        email,
        name,
      },
    })
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse
      return data
    }

    const data = (await res.json()) as unknown as ErrorResponse
    return data
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse
  }
}

export const postLogin = async (email: string, password: string) => {
  try {
    const res = await client.auth.login.$post({
      form: {
        email,
        password,
      },
    })
    if (res.ok) {
      const data = (await res.json()) as SuccessResponse
      return data
    }
    const data = (await res.json()) as unknown as ErrorResponse

    return data
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse
  }
}

export const getUser = async () => {
  const res = await client.auth.user.$get()
  if (res.ok) {
    const data = await res.json()
    return {
      email: data.data.email,
      name: data.data.name,
      avatar: data.data.avatar,
      phone: data.data.phone,
    }
  }
  return null
}

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
    retry: false, // Don't retry on error
  })

export const getLeads = async () => {
  const res = await client.leads.$get()
  if (res.ok) {
    const data = await res.json()
    return data
  }
  throw new Error('Failed to fetch leads')
}

export const createLead = async (lead: Omit<Lead, 'id'>) => {
  const res = await client.leads.$post({
    body: {
      ...lead,
      lastContact: lead.lastContact ? new Date(lead.lastContact) : undefined
    },
  })
  if (res.ok) {
    const data = await res.json()
    return data
  }
  throw new Error('Failed to create lead')
}

export const updateLead = async ({ id, ...lead }: Lead) => {
  const res = await client.leads[":id"].$patch(
    {
      param: { id: id.toString() },
      json: {
        ...lead,
        lastContact: lead.lastContact ? new Date(lead.lastContact) : undefined
      },
    }
  )
  if (res.ok) {
    const data = await res.json()
    return data
  }
  throw new Error('Failed to update lead')
}

export const deleteLead = async (id: number) => {
  const res = await client.leads[':id'].$delete({
    param: { id: id.toString() },
  })
  if (res.ok) {
    const data = await res.json()
    return data
  }
  throw new Error('Failed to delete lead')
}

export const getTimelineEvents = async (leadId: number) => {
  const res = await client.timeline[':leadId'].$get({
    param: { leadId: leadId.toString() },
  })
  if (res.ok) {
    const data = await res.json()
    return data
  }
  throw new Error('Failed to fetch timeline events')
}

export const createTimelineEvent = async (event: {
  leadId: number
  type: 'status_change' | 'note_added' | 'contact' | 'meeting_scheduled' | 'document_added'
  description: string
  metadata?: Record<string, unknown>
}) => {
  const res = await client.timeline.$post({
    json: event,
  })
  if (res.ok) {
    const data = await res.json()
    return data
  }
  throw new Error('Failed to create timeline event')
}
