import { usePage } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

import CommunityRecipes from '@/components/recipes/community-recipes'
import { Advertisement } from '@/types/advertisement'

type Props = {
  ads: Advertisement[]
}

export default function RecipesPage({ ads }: Props) {
  return (
    <CommunityLayoutNoRight ads={ads}>
      <section className="mx-auto max-w-7xl px-0 lg:px-6 space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold text-gray-900">
            Recipes
          </h1>
          <p className="mt-1 text-gray-500">
            Community-submitted recipes
          </p>
        </header>

        {/* Content */}
        <CommunityRecipes />

      </section>
    </CommunityLayoutNoRight>
  )
}
