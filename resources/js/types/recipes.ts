// components/recipes/types.ts

export type Fit30Recipe = {
  id: number
  slug: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string
      alt_text?: string
    }>
  }
}

export type IngredientRow = {
  amount: string
  unit: string
  name: string
}

export type CommunityRecipe = {
  id: number
  title: string
  excerpt: string
  ingredients: IngredientRow[]
  instructions: string[]
  image_url?: string | null
  user: {
    id: number
    name: string
    avatar_url?: string | null
  }
}

export type Recipe = Fit30Recipe | CommunityRecipe

export function isFit30Recipe(recipe: Recipe): recipe is Fit30Recipe {
  return typeof recipe.title !== 'string'
}