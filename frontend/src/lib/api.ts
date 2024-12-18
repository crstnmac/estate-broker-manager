import type {ApiRoutes, ErrorResponse, SuccessResponse} from '@/shared/types'
import {queryOptions} from '@tanstack/react-query'
import {hc} from 'hono/client'

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
