import { Head } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth-layout'
import { Button } from '@/components/ui/button'

type Props = {
  product?: {
    name: string
    price: string
    description?: string
    priceId: string
  }
}

export default function Payment({ product }: Props) {
  if (!product) {
    return (
      <AuthLayout
        title="Payment error"
        description="We couldn’t load your purchase details."
      >
        <p className="text-center text-sm text-muted-foreground">
          Please restart the purchase process.
        </p>
      </AuthLayout>
    )
  }

  function submit() {
    const csrf =
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content ?? ''

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/checkout'

    form.innerHTML = `
      <input type="hidden" name="_token" value="${csrf}">
      <input type="hidden" name="price_id" value="${product.priceId}">
      <input type="hidden" name="terms_accepted" value="1">
    `

    document.body.appendChild(form)
    form.submit()
  }

  return (
    <AuthLayout
      title="Confirm your purchase"
      description="Review your order before completing payment"
    >
      <Head title="Payment" />

      <div className="space-y-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">
            {product.name}
          </h2>

          {product.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-4 text-2xl font-bold">
            {product.price}
          </div>
        </div>

        <Button onClick={submit} className="w-full">
          Complete purchase
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Secure checkout • Powered by Stripe
        </p>
      </div>
    </AuthLayout>
  )
}
