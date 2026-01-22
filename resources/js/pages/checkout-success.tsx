import { Head, Link } from '@inertiajs/react'
import { community } from '@/routes'

export default function CheckoutSuccess() {
  return (
    <>
      <Head title="Payment Successful" />

      <div className="min-h-screen bg-gradient-to-br from-[#fff7f2] to-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">

          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f97316]/15 text-[#f97316] text-3xl">
            ✓
          </div>

          <h1 className="text-3xl font-semibold mb-3 text-[#1b1b18]">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Your Fit30 program is now unlocked.  
            You can access your cohort and begin right away.
          </p>

          <Link
            href={community()}
            className="inline-block rounded-md bg-[#f97316] px-8 py-3 text-white font-medium hover:bg-[#ea580c] transition shadow-sm"
          >
            Go to Community
          </Link>

        </div>
      </div>
    </>
  )
}
