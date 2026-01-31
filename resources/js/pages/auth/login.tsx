import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'; 

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <div className="mt-6 text-center">
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
                >View demo login credentials
                </button>
            </div>
            <Head title="Log in" />
            
            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        e.currentTarget.requestSubmit()
                    }
                }}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>
                    </>
                )}
            </Form>
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
                                    demo@blacklabdev.com
                                </code>
                            </div>

                            <div>
                                <div className="font-medium">Password</div>
                                <code className="block rounded bg-background px-3 py-2">
                                    demopassword
                                </code>
                            </div>
                        </div>

                        <DialogFooter>
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
    );
}
