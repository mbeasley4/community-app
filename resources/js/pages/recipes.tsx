import { useState } from 'react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

import Fit30Recipes from '@/components/recipes/fit30-recipes'
import CommunityRecipes from '@/components/recipes/community-recipes'

export default function RecipesPage() {
  const [tab, setTab] = useState<'whole30' | 'community'>('whole30')

  return (
    <CommunityLayoutNoRight>
      <section className="mx-auto max-w-7xl px-6 space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold text-gray-900">
            Recipes
          </h1>
          <p className="mt-1 text-gray-500">
            Fit30 recipes and community submissions
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-0.5 border-b-2 border-orange-600">
          <button
            onClick={() => setTab('whole30')}
            className={`pb-2 text-sm font-medium ${
              tab === 'whole30'
                ? 'border-l-2 border-r-2 border-t-2 rounded-t-sm p-2 border-orange-600 text-white bg-orange-600'
                : 'border-l-2 border-r-2 border-t-2 rounded-t-sm p-2 border-gray-500 text-gray-500'
            }`}
          >
            Fit30 Recipes
          </button>
          <button
            onClick={() => setTab('community')}
            className={`pb-2 text-sm font-medium ${
              tab === 'community'
                ? 'border-l-2 border-r-2 border-t-2 rounded-t-sm p-2 border-orange-600 text-white bg-orange-600'
                : 'border-l-2 border-r-2 border-t-2 rounded-t-sm p-2 border-gray-500 text-gray-500'
            }`}
          >
            User Recipes
          </button>
        </div>

        {/* Content */}
        {tab === 'whole30' && <Fit30Recipes />}
        {tab === 'community' && <CommunityRecipes />}

      </section>
    </CommunityLayoutNoRight>
  )
}
