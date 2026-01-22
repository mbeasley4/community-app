import { Head, Link } from '@inertiajs/react'
import { login } from '@/routes'

export default function CheckoutError() {
  return (
    <>
      <Head title="Payment Error" />

      <div className="min-h-screen bg-gradient-to-br from-[#fff7f2] to-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">

          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-3xl">
            !
          </div>

          <h1 className="text-3xl font-semibold mb-3 text-[#1b1b18]">
            Something went wrong
          </h1>

          <p className="text-gray-600 mb-8">
            Your payment was not completed. No charges were made.  
            You can try again or contact support if the issue persists.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/#pricing"
              className="rounded-md border border-[#f97316] px-6 py-3 font-medium text-[#f97316] hover:bg-[#fff7f2] transition"
            >
              Try Again
            </Link>

            <Link
              href={login()}
              className="rounded-md bg-[#f97316] px-6 py-3 text-white font-medium hover:bg-[#ea580c] transition shadow-sm"
            >
              Log in
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
