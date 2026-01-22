import { Recipe, isFit30Recipe } from '@/types/recipes'

type RecipeGridProps = {
  recipes: Recipe[]
  externalLinks?: boolean
}

export default function RecipeGrid({ recipes, externalLinks }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {recipes.map(recipe => {
        const Fit30 = isFit30Recipe(recipe)

        // Normalize fields across recipe types
        const title = Fit30
          ? recipe.title.rendered
          : recipe.title

        const excerpt = Fit30
          ? recipe.excerpt.rendered
          : recipe.excerpt

        const imageUrl = Fit30
          ? recipe._embedded?.['wp:featuredmedia']?.[0]?.source_url
          : recipe.image_path || undefined

        const link = Fit30
          ? recipe.link
          : undefined

        return (
          <article
            key={recipe.id}
            className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
          >
            {imageUrl && (
              externalLinks && link ? (
                <a href={link} target="_blank" rel="noreferrer">
                  <img
                    src={
                      Fit30
                        ? `/img?url=${encodeURIComponent(imageUrl)}`
                        : imageUrl
                    }
                    alt={title}
                    className="h-50 w-full object-cover transition group-hover:scale-105"
                  />
                </a>
              ) : (
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-50 w-full object-cover"
                />
              )
            )}

            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>

              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: excerpt ?? '' }}
              />
              {!Fit30 && (
                <div className="text-xs text-gray-500">
                  Posted
                  {recipe.user?.name
                    ? ` by ${recipe.user.name}`
                    : ''} 
                  {' '}on {new Date(recipe.created_at).toLocaleDateString()}
                </div>
              )}

              {externalLinks && link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-800"
                >
                  View recipe →
                </a>
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
