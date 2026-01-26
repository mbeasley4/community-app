import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { CommunityRecipe } from '@/types/recipes'

export default function RecipeShow() {
  const [recipe, setRecipe] = useState<CommunityRecipe | null>(null)
  const [loading, setLoading] = useState(true)

  const recipeId = window.location.pathname.split('/').pop()

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/community-recipes/${recipeId}`)
      const json = await res.json()
      setRecipe(json)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <CommunityLayoutNoRight>
        <div className="p-6 text-gray-600">Loading recipe…</div>
      </CommunityLayoutNoRight>
    )
  }

  if (!recipe) {
    return (
      <CommunityLayoutNoRight>
        <div className="p-6 text-gray-600">Recipe not found.</div>
      </CommunityLayoutNoRight>
    )
  }

  return (
    <CommunityLayoutNoRight>
      <div className="mx-auto max-w-4xl px-6 pb-10">

        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/recipes?tab=community"
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back to Community Recipes
          </Link>
        </div>

        {/* Hero Image */}
        {recipe.image && (
          <div className="mb-6 overflow-hidden rounded-2xl shadow">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-[420px] w-full object-cover"
            />
          </div>
        )}

        {/* Header Card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-3">

          <h1 className="text-3xl font-semibold text-gray-900">
            {recipe.title}
          </h1>

          <div className="text-sm text-gray-500">
            Posted by{' '}
            <span className="font-medium text-gray-700">
              {recipe.user?.name ?? 'Community member'}
            </span>
            {' '}on{' '}
            {new Date(recipe.created_at).toLocaleDateString()}
          </div>

          <p className="text-gray-700 leading-relaxed">
            {recipe.excerpt}
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Ingredients */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Ingredients
            </h2>

            <ul className="space-y-2 text-gray-800">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-medium text-gray-900 w-20 shrink-0">
                    {ing.amount} {ing.unit}
                  </span>
                  <span>{ing.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Instructions
            </h2>

            <ol className="space-y-3 list-decimal list-inside text-gray-800">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </CommunityLayoutNoRight>
  )
}
