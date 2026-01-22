import { community, login } from '@/routes'
import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import Pricing, { type PriceOption } from '@/components/pricing'
import Benefits from '@/components/benefits'
import W30ProgramCallout from '@/components/w30-program-callout'

export default function Home() {
  const { auth } = usePage<SharedData>().props

  const pricing: PriceOption[] = [
    {
      id: 'cohort',
      name: 'Fit30 Cohort',
      description: 'Guided 30-day program with live group accountability',
      price: '$325',
      priceId: 'price_1SrJunPAqkOdrASefkMapB4h'
    },
    {
      id: 'foundation',
      name: 'Foundation Courses',
      description: 'Self-paced Fit30 education & habit training',
      price: '$250',
      priceId: 'price_1SrJu4PAqkOdrASegZWwohfD'
    },
    {
      id: 'bundle',
      name: 'Cohort + Foundations',
      description: 'Complete experience — best value',
      price: '$400',
      priceId: 'price_1SrJspPAqkOdrASebd3vsg1u',
      highlight: true
    },
    {
      id: 'reintro',
      name: 'Reintroduction Courses',
      description: 'Self-paced Fit30 education & reintroduction to Food Freedom.',
      price: '$250',
      priceId: 'price_1SrJspPAqkOdrASebd3vsg1u'
    }
  ]

  const checkout = (priceId: string, termsAccepted = false) => {
    const csrf =
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.content ?? ''

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/checkout'

    const priceInput = document.createElement('input')
    priceInput.type = 'hidden'
    priceInput.name = 'price_id'
    priceInput.value = priceId

    const termsInput = document.createElement('input')
    termsInput.type = 'hidden'
    termsInput.name = 'terms_accepted'
    termsInput.value = termsAccepted ? '1' : '0'

    form.appendChild(termsInput)

    const csrfInput = document.createElement('input')
    csrfInput.type = 'hidden'
    csrfInput.name = '_token'
    csrfInput.value = csrf

    form.appendChild(priceInput)
    form.appendChild(termsInput)
    form.appendChild(csrfInput)
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <>
      <Head title="Fit30 Cohort" />

      <div className="min-h-screen bg-white text-[#1b1b18]">

        {/* HEADER */}
        <header className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <img src="/images/logos/f30-cohort.png" className="h-14" alt="Whole30" />

          <nav className="flex items-center gap-3 text-sm">
            {auth.user ? (
              <Link
                href={community()}
                className="rounded-md bg-[#f97316] px-5 py-2 text-white font-medium hover:bg-[#ea580c] transition shadow-sm"
              >
                Go to Community
              </Link>
            ) : (
              <>
                <Link
                  href={login()}
                  className="rounded-md border border-[#f97316] px-5 py-2 font-medium text-[#f97316] hover:bg-[#fff7f2] transition"
                >
                  Log in
                </Link>

                <a
                  href="#pricing"
                  className="rounded-md bg-[#f97316] px-5 py-2 text-white font-medium hover:bg-[#ea580c] transition shadow-sm"
                >
                  Check program pricing
                </a>
              </>
            )}
          </nav>
        </header>


        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fff7f2] via-white to-[#fff]">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#ffd9bf] blur-3xl opacity-40" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#ffedd5] blur-3xl opacity-50" />

          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-6 py-14">

            {/* LEFT */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#da5b01] shadow-sm border mb-4">
                Guided Fit30 Cohort
              </span>

              <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-4">
                Reset your habits.<br />
                <span className="text-[#da5b01]">Transform your health.</span>
              </h1>

              <p className="text-base text-gray-700 mb-6 max-w-md">
                A structured 30-day reset with real accountability, community support,
                and expert guidance — built to help you actually finish.
              </p>

              {!auth.user && (
                <a
                  href="#pricing"
                  className="inline-block rounded-md bg-[#f97316] px-7 py-3 text-white font-medium hover:bg-[#ea580c] transition"
                >
                  Check program pricing
                </a>
              )}

              {auth.user && (
                <Link
                  href={community()}
                  className="rounded-md bg-[#f97316] px-7 py-3 text-white font-medium hover:bg-[#ea580c] transition"
                >
                  Go to Community
                </Link>
              )}
            </div>

            {/* RIGHT - LAYERED IMAGES */}
            <div className="relative flex justify-center lg:justify-end">
              <img
                src="/images/w30-meal-1.png"
                alt="Fit30 Meal"
                className="absolute -left-6 top-10 w-56 rounded-xl shadow-lg rotate-[-6deg] hidden sm:block"
              />

              <img
                src="/images/w30-welcome.png"
                alt="Fit30 Food"
                className="relative w-72 rounded-2xl shadow-xl z-10"
              />

              <img
                src="/images/w30-meal-2.png"
                alt="Healthy Plate"
                className="absolute -right-4 -bottom-6 w-52 rounded-xl shadow-lg rotate-[6deg] hidden sm:block"
              />
            </div>
          </div>
        </section>

        <Benefits />

        {/* PRICING COMPONENT */}
        <Pricing
          pricing={pricing}
          auth={auth}
          checkout={checkout}
        />

       <W30ProgramCallout />

      </div>
    </>
  )
}
