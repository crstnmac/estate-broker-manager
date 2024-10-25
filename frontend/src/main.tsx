import ReactDOM from 'react-dom/client'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {routeTree} from './routeTree.gen'
import './main.css'
import React from 'react'

const queryClient = new QueryClient()

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // this will ensure loader is cancelled always when the route is preloaded or visited, since we are using react-query we don't want loader calls to ever be stale
  defaultPreloadStaleTime: 6000
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  )
}
