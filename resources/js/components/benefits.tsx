import { LayoutGrid, Users, Leaf } from 'lucide-react'

type Benefit = {
  title: string
  description: string
  link: string
  linkText: string
  icon: React.ReactNode
}

const benefits: Benefit[] = [
  {
    title: 'Structure',
    description: 'Follow a proven day-by-day program built for real success.',
    link: 'https://whole30.com/whole30-program/',
    linkText: 'Learn about the program',
    icon: <LayoutGrid className="h-8 w-8" />
  },
  {
    title: 'Support',
    description: 'Get guidance, community, and accountability to finish strong.',
    link: 'https://whole30.com/community/',
    linkText: 'Explore the community',
    icon: <Users className="h-8 w-8" />
  },
  {
    title: 'Sustainability',
    description: 'Learn Food Freedom so results last far beyond Day 30.',
    link: 'https://whole30.com/reintroduction/',
    linkText: 'Learn about Food Freedom',
    icon: <Leaf className="h-8 w-8" />
  }
]

export default function Benefits() {
  return (
    <section className="bg-[#da5b01] py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-center">

        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex flex-col items-center rounded-xl border border-white/70 bg-[#da5b01] px-6 py-7 text-white shadow-sm"
          >
            {/* Icon bubble */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              {benefit.icon}
            </div>

            <h3 className="text-lg font-semibold mb-2">
              {benefit.title}
            </h3>

            <p className="text-sm opacity-90 mb-5">
              {benefit.description}
            </p>

            <a
              href={benefit.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-5 py-2 text-sm font-medium text-[#da5b01] hover:bg-[#fff3ec] transition shadow-sm"
            >
              {benefit.linkText}
            </a>
          </div>
        ))}

      </div>
    </section>
  )
}
