import { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'

import InputError from '@/components/input-error'
import TextLink from '@/components/text-link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import AuthLayout from '@/layouts/auth-layout'
import { request } from '@/routes/password'


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'

interface LoginProps {
    status?: string
    canResetPassword: boolean
}

const DEMO_CREDENTIALS = {
    email: 'demo@blacklabdev.com',
    password: 'demopassword',
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
    const [showDemoModal, setShowDemoModal] = useState(false)

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    function useDemoCredentials() {
        form.setData({
            email: DEMO_CREDENTIALS.email,
            password: DEMO_CREDENTIALS.password,
            remember: true,
        })

        setShowDemoModal(false)
    }

    function submit(e: React.FormEvent) {
        e.preventDefault()
        form.post('/login')
    }

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            {/* Demo trigger */}
            <div className="mb-6 text-center">
                <button
                    type="button"
                    onClick={() => setShowDemoModal(true)}
                    className="
                        inline-flex items-center gap-2
                        rounded-md px-4 py-2 text-sm font-medium
                        bg-primary/10 text-primary
                        hover:bg-primary/20
                        transition
                    "
                >
                    Try the demo account
                </button>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            required
                            autoFocus
                            autoComplete="email"
                            placeholder="email@example.com"
                        />
                        <InputError message={form.errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm"
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                            required
                            autoComplete="current-password"
                            placeholder="Password"
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    {/* Remember */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            checked={form.data.remember}
                            onCheckedChange={(checked) =>
                                form.setData('remember', Boolean(checked))
                            }
                        />
                        <Label>Remember me</Label>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        disabled={form.processing}
                    >
                        {form.processing && <Spinner />}
                        Log in
                    </Button>
                </div>
            </form>

            {/* Demo modal */}
            <Dialog open={showDemoModal} onOpenChange={setShowDemoModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Demo Account</DialogTitle>
                        <DialogDescription>
                            Use the credentials below to explore the application.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 rounded-md bg-muted p-4 text-sm">
                        <div>
                            <div className="font-medium">Email</div>
                            <code className="block rounded bg-background px-3 py-2">
                                {DEMO_CREDENTIALS.email}
                            </code>
                        </div>

                        <div>
                            <div className="font-medium">Password</div>
                            <code className="block rounded bg-background px-3 py-2">
                                {DEMO_CREDENTIALS.password}
                            </code>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button onClick={useDemoCredentials}>
                            Use demo account
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setShowDemoModal(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    )
}
