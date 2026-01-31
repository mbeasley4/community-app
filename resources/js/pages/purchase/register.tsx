import { Head, useForm } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth-layout'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Register() {
  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/purchase/register')
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Create your account to continue your purchase"
    >
      <Head title="Create account" />

      <form onSubmit={submit} className="space-y-6">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input
            value={form.data.name}
            onChange={e => form.setData('name', e.target.value)}
            required
          />
          <InputError message={form.errors.name} />
        </div>

        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.data.email}
            onChange={e => form.setData('email', e.target.value)}
            required
          />
          <InputError message={form.errors.email} />
        </div>

        <div className="grid gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={form.data.password}
            onChange={e => form.setData('password', e.target.value)}
            required
          />
          <InputError message={form.errors.password} />
        </div>

        <div className="grid gap-2">
          <Label>Confirm password</Label>
          <Input
            type="password"
            value={form.data.password_confirmation}
            onChange={e =>
              form.setData('password_confirmation', e.target.value)
            }
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={form.processing}
        >
          Continue
        </Button>
      </form>
    </AuthLayout>
  )
}
