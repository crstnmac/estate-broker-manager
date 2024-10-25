import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import FieldInfo from '@/components/utils/fieldInfo'
import {useForm} from '@tanstack/react-form'
import {createFileRoute, Link} from '@tanstack/react-router'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {z} from 'zod'
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert' // Import the Alert component
import {useState} from 'react' // Import useState
import {api} from '@/lib/api'
import {useMutation} from '@tanstack/react-query'
import {LoaderCircle} from 'lucide-react'

export const Route = createFileRoute('/auth/register')({
  component: RegisterComponent,
})

const registerUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
})

function RegisterComponent() {
  const [error, setError] = useState<string | null>(null) // State for error message

  const $register = api.auth.register.$post // Call the register function

  const {
    data: user,
    isPending: submitting,
    mutate: register,
  } = useMutation({
    mutationFn: $register,
    onSuccess: (data) => {
      console.log('data', data)
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: registerUserSchema,
    },
    onSubmit: async ({value}) => {
      try {
        register({
          form: {
            ...value,
            role: 'user',
          },
        }) // Call the register function
      } catch (err) {
        setError('Registration failed. Please try again.') // Set error message
      }
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        {error && (
          <Alert>
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <form.Field name="name">
              {(field) => (
                <>
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>
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
              to="/"
              className="text-blue-300 hover:underline hover:text-blue-600"
            >
              Already have an account? Login
            </Link>
          </div>
          <Button type="submit" className="w-full">
            {submitting && <LoaderCircle className="w-5 h-5" />}
            Register
          </Button>
        </form>
      </div>
    </div>
  )
}
