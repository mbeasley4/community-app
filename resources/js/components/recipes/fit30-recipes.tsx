import { useEffect, useState } from 'react'
import RecipeGrid from './recipe-grid'
import { fit30Recipe as Recipe } from '@/types/recipes'

type ApiResponse = {
  data: Recipe[]
  pagination: {
    page: number
    pages: number
    total: number
  }
}

export default function fit30Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchRecipes(pageNumber: number, append = false) {
    try {
      if (pageNumber === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }


      const res = await fetch(`/api/recipes?page=${pageNumber}`)
      if (!res.ok) throw new Error()

      const json: ApiResponse = await res.json()

      setRecipes(prev => append ? [...prev, ...json.data] : json.data)
      setPage(json.pagination.page)
      setPages(json.pagination.pages)
    } catch {
      setError('Unable to load recipes')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchRecipes(1)
  }, [])

  return (
    <>
      {loading && (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
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
        <RecipeGrid recipes={recipes} externalLinks />
      )}

      {!loading && page < pages && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => fetchRecipes(page + 1, true)}
            disabled={loadingMore}
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  )
}
