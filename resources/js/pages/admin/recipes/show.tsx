import { router } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function ReviewRecipe({ recipe }) {
  function approve() {
    router.post(`/admin/recipes/${recipe.id}/approve`)
  }

  function reject() {
    router.post(`/admin/recipes/${recipe.id}/reject`)
  }

  function remove() {
    if (confirm('Delete recipe permanently?')) {
      router.delete(`/admin/recipes/${recipe.id}`)
    }
  }

  return (
    <CommunityLayoutNoRight>
      <div className="mx-auto max-w-3xl px-6 space-y-6">

        <h1 className="text-2xl font-semibold">
          Review Recipe
        </h1>

        <div className="rounded border bg-white p-5 space-y-3">

          <h2 className="text-xl font-medium">{recipe.title}</h2>

          <div className="text-sm text-gray-500">
            Submitted by {recipe.user.name} on{' '}
            {new Date(recipe.created_at).toLocaleDateString()}
          </div>

          {recipe.image_path && (
            <img
              src={`/storage/${recipe.image_path}`}
              className="rounded-lg max-h-80 object-cover"
            />
          )}

          <p>{recipe.excerpt}</p>

          <div>
            <h3 className="font-medium">Ingredients</h3>
            <ul className="list-disc list-inside">
              {recipe.ingredients.map((i,idx)=>(
                <li key={idx}>{i.amount} {i.unit} {i.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium">Instructions</h3>
            <ol className="list-decimal list-inside">
              {recipe.instructions.map((s,idx)=>(
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={approve}
              className="rounded bg-green-600 px-4 py-2 text-sm text-white"
            >
              Approve
            </button>

            <button
              onClick={reject}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white"
            >
              Reject
            </button>

            <button
              onClick={remove}
              className="ml-auto rounded border px-4 py-2 text-sm"
            >
              Delete
            </button>
          </div>

        </div>
      </div>
    </CommunityLayoutNoRight>
  )
}
