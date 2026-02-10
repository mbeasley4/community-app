import { community } from '@/routes'
import { Link, usePage } from '@inertiajs/react'
import { type SharedData } from '@/types'

export default function HomeHero() {
    const { auth } = usePage<SharedData>().props
    return (
        <>
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#fff7f2] via-white to-[#fff]">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#ffd9bf] blur-3xl opacity-40" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#ffedd5] blur-3xl opacity-50" />

            <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-6 py-14">

            {/* LEFT */}
            <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#da5b01] shadow-sm border mb-4">
                Guided Fit30 Cycle
                </span>

                <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-4">
                Reset your rhythm.
                <span className="text-[#da5b01]">Level up your health.</span>
                </h1>

                <p className="text-base text-gray-700 mb-6 max-w-md">A no-fluff 30-day reset with real accountability, real support, and expert guidance—built so you actually finish.</p>

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
    </>
    )
}