import * as React from 'react'

import {QueryClient, useMutation, useQuery} from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import Layout from '@/components/layout'
import {z} from 'zod'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})




function RootComponent() {

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
