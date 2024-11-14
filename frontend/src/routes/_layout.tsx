import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'
import {userQueryOptions} from '@/lib/api'
import Layout from '@/components/layout'

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({context, location}) => {
    // Force a fresh fetch of user data
    const user = await context.queryClient.ensureQueryData(userQueryOptions())
    if (!user) {
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: location.href,
        },
      })
    }
    return { user }
  },

  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})
