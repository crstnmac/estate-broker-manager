import { postLogin, userQueryOptions, getUser } from '@/lib/api'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  Link,
  useNavigate,
} from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter'

import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FieldInfo from '@/components/utils/fieldInfo'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { loginSchema } from '@/shared/types'

const loginSearchSchema = z.object({
  redirect: fallback(z.string(), '/').default('/'),
})

export const Route = createFileRoute('/auth/login')({
  component: Login,
  validateSearch: zodSearchValidator(loginSearchSchema),
})

function Login() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const search = Route.useSearch()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await postLogin(value.email, value.password)
      if (res.success) {
        // Fetch fresh user data after login
        const userData = await getUser()
        if (userData) {
          // Set the complete user data in the cache
          await queryClient.setQueryData(['user'], userData)
          
          // Navigate to the redirect path
          navigate({
            to: search.redirect,
            replace: true,
          })
          return null
        } else {
          toast.error('Failed to fetch user data')
          return 'Failed to fetch user data'
        }
      } else {
        if (!res.isFormError) {
          toast.error('Login failed. Please try again.', {
            description: res.error,
          })
        }
        form.setErrorMap({
          onSubmit: res.isFormError ? res.error : 'Unexpected error',
        })
        return res.error
      }
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <form.Field name="email">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
          <div className="space-y-2">
            <form.Field name="password">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
          <form.Subscribe selector={(state) => [state.errorMap]}>
            {([errorMap]) =>
              errorMap.onSubmit ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {typeof errorMap.onSubmit === 'string'
                    ? errorMap.onSubmit
                    : JSON.stringify(errorMap.onSubmit)}
                </p>
              ) : null
            }
          </form.Subscribe>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isSubmitting && (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                )}
                Login
              </Button>
            )}
          </form.Subscribe>
          <div className="space-y-2">
            Don't have an account?{''}
            <Link
              to="/auth/register"
              className="text-blue-400 hover:underline hover:text-blue-600"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
