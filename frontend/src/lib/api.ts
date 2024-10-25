import {ApiRoutes} from '@server/app'
import {queryOptions} from '@tanstack/react-query'
import {hc} from 'hono/client'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
  const res = await api.auth.me.$get()
  if (!res.ok) {
    throw new Error('Failed to get current user')
  }
  const data = await res.json()
  return data
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
  retry: false,
})
