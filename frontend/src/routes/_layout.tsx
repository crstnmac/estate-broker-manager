import {createFileRoute, Link, Outlet, useRouter} from '@tanstack/react-router'
import {api, userQueryOptions} from '@/lib/api'
import {useForm} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import FieldInfo from '@/components/utils/fieldInfo'
import {Button} from '@/components/ui/button'
import {LoaderCircle} from 'lucide-react'
import {z} from 'zod'
import {useMutation} from '@tanstack/react-query'

export const Route = createFileRoute('/_layout')({
  beforeLoad: async ({context}) => {
    const queryClient = context.queryClient

    try {
      const data = await queryClient.fetchQuery(userQueryOptions)

      return data
    } catch (error) {
      return {
        user: null,
      }
    }
  },

  component: AuthedComponent,
})

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

async function login(user: {email: string; password: string}) {
  const res = await api.auth.login.$post({
    form: user,
  })
  const data = await res.json()
  return data
}

function Login() {
  const router = useRouter()

  const {
    data: user,
    isPending: submitting,
    mutate: loginUser,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('data', data)
      router.invalidate()
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: loginUserSchema,
    },
    onSubmit: async ({value}) => {
      loginUser(value)
    },
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

          <div className="space-y-2">
            <Link
              to="/auth/register"
              className="text-blue-400 hover:underline hover:text-blue-600"
            >
              Register
            </Link>
          </div>
          <Button type="submit" className="w-full">
            {submitting && <LoaderCircle className="w-5 h-5" />}
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}

function AuthedComponent() {
  const {user} = Route.useRouteContext()

  if (!user) {
    return <Login />
  }

  return <Outlet />
}
