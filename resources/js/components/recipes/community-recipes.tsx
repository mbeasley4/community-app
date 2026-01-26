import { useEffect, useState } from 'react'
import RecipeGrid from './recipe-grid'
import SubmitRecipeButton from './submit-recipe-button' 
import { CommunityRecipe } from '@/types/recipes'

export default function CommunityRecipes() {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadRecipes() {
    try {
      setLoading(true)
      const res = await fetch('/api/community-recipes')

      if (!res.ok) {
        throw new Error()
      }

      const json = await res.json()

      // json.data already includes image_path from Laravel
      setRecipes(json.data)
    } catch {
      setError('Unable to load user recipes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  return (
    <div className="space-y-8">
      <SubmitRecipeButton onSubmitted={loadRecipes} onClose={undefined} />

      {loading && (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 rounded bg-gray-200" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <RecipeGrid recipes={recipes} />
      )}
    </div>
  )
}
