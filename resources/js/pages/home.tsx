import { community, login } from '@/routes'
import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import Benefits from '@/components/sections/benefits'
import ProgramCallout from '@/components/program-callout'
import Pricing from '@/components/sections/pricing';
import HomeHero from '@/components/sections/home-hero'

export default function Home() {
  const { auth } = usePage<SharedData>().props

  return (
    <>
      <Head title="Fit30 Cohort" />

      <div className="min-h-screen bg-white text-[#1b1b18]">

        {/* HEADER */}
        <header className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <img src="/images/logos/f30-cycle.png" className="h-14" alt="Fit30 Cycle" />

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
                  className="hidden lg:block rounded-md bg-[#f97316] px-5 py-2 text-white font-medium hover:bg-[#ea580c] transition shadow-sm"
                >
                  Check program pricing
                </a>
              </>
            )}
          </nav>
        </header>
    
        <HomeHero/>

        <Benefits />

        {/* PRICING COMPONENT */}
        <Pricing auth={auth} />


       <ProgramCallout />

      </div>
    </>
  )
}
