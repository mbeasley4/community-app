import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { community } from '@/routes'
import { type SharedData } from '@/types'

export type PriceOption = {
  id: string
  name: string
  description: string
  price: string
  priceId: string
  highlight?: boolean
}

type PricingProps = {
  auth: SharedData['auth']
}

export default function Pricing({ auth }: PricingProps) {
  const [pricing, setPricing] = useState<PriceOption[]>([])
  const [showTerms, setShowTerms] = useState(false)
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null)

  // Load products from database
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setPricing)
  }, [])

  // Open terms modal
  function handlePurchaseClick(priceId: string) {
    setSelectedPriceId(priceId)
    setShowTerms(true)
  }

  // Send to Stripe checkout
  function checkout(priceId: string, termsAccepted = false) {
    const csrf =
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content ?? ''

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/checkout'

    form.innerHTML = `
      <input type="hidden" name="_token" value="${csrf}">
      <input type="hidden" name="price_id" value="${priceId}">
      <input type="hidden" name="terms_accepted" value="${termsAccepted ? '1' : ''}">
    `

    document.body.appendChild(form)
    form.submit()
  }

  function acceptTermsAndCheckout() {
    if (selectedPriceId) {
      checkout(selectedPriceId, true)
    }
  }

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl font-semibold mb-3">
        Choose your program
      </h2>

      <p className="text-gray-600 mb-10">
        Purchase a Cohort, Foundation Courses, or save with the bundle.
      </p>

      {/* Pricing Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pricing.map(option => (
          <div
            key={option.id}
            className={`rounded-xl border p-6 shadow-sm bg-white ${
              option.highlight
                ? 'border-[#da5b01] ring-2 ring-[#da5b01]'
                : ''
            }`}
          >
            {option.highlight && (
              <div className="text-xs font-semibold text-[#da5b01] mb-2">
                MOST POPULAR
              </div>
            )}

            <h3 className="text-lg font-semibold mb-2">
              {option.name}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {option.description}
            </p>

            <div className="text-4xl font-bold mb-5">
              {option.price}
            </div>

            {/* Logged out → Buy */}
            {!auth.user && (
              <button
                onClick={() => handlePurchaseClick(option.priceId)}
                className="w-full rounded-md bg-[#f97316] px-4 py-2 font-medium text-white hover:bg-[#ea580c]"
              >
                Get Started
              </button>
            )}

            {/* Logged in → Go to community */}
            {auth.user && (
              <Link
                href={community()}
                className="w-full inline-block rounded-md bg-[#f97316] px-4 py-2 font-medium text-white hover:bg-[#ea580c]"
              >
                Go to Community
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="max-w-lg w-full bg-white rounded-xl p-6 text-left shadow-lg">
            <h3 className="text-lg font-semibold mb-3">
              Terms & Conditions
            </h3>

            <div className="text-sm text-gray-600 space-y-3 max-h-72 overflow-y-auto pr-2">
              <p>
                By purchasing this program, you agree that this Fit30 Cohort
                experience is for educational purposes only and does not replace
                professional medical advice. Results may vary.
              </p>

              <p>
                All sales are final. Program access is tied to the purchasing
                account and may not be transferred.
              </p>

              <p>
                Participation requires respectful conduct inside the cohort
                community and adherence to community guidelines.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>

              <button
                onClick={acceptTermsAndCheckout}
                className="px-4 py-2 text-sm rounded-md bg-[#f97316] text-white hover:bg-[#ea580c]"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
