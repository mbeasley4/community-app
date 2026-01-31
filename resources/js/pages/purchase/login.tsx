import { Head, Link, useForm } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth-layout'
import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { request } from '@/routes/password'

type Props = {
  email?: string
}

export default function PurchaseLogin({ email }: Props) {
  const form = useForm({
    email: email ?? '',
    password: '',
    remember: true,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/purchase/login')
  }

  return (
    <AuthLayout
      title="Log in to continue"
      description="We found an existing account for that email. Log in to complete your purchase."
    >
      <Head title="Purchase Login" />

      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={form.data.email}
              onChange={(e) => form.setData('email', e.target.value)}
              required
              autoComplete="email"
              placeholder="email@example.com"
            />
            <InputError message={form.errors.email} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <TextLink
                href={request()}
                className="ml-auto text-sm"
              >
                Forgot password?
              </TextLink>
            </div>
            <Input
              id="password"
              type="password"
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
            />
            <InputError message={form.errors.password} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.processing}
          >
            {form.processing && <Spinner />}
            Continue to payment
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Need a new account?{' '}
            <Link
              href="/purchase/start"
              className="underline hover:text-foreground"
            >
              Go back to registration
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
