import { useState } from 'react'
import { UNITS } from '@/config/units'
import type { IngredientRow } from '@/types/recipes'

export default function SubmitRecipeModal({
  onClose,
  onSubmitted
}: {
  onClose: () => void
  onSubmitted: () => void
}) {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { amount: '', unit: '', name: '' }
  ])
  const [instructions, setInstructions] = useState<string[]>([''])
  const [image, setImage] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function updateIngredient(
    index: number,
    field: keyof IngredientRow,
    value: string
  ) {
    setIngredients(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    )
  }

  function addIngredient() {
    setIngredients(prev => [...prev, { amount: '', unit: '', name: '' }])
  }

  function updateInstruction(index: number, value: string) {
    setInstructions(prev =>
      prev.map((step, i) => (i === index ? value : step))
    )
  }

  function addInstruction() {
    setInstructions(prev => [...prev, ''])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const fd = new FormData()
    fd.append('title', title)
    fd.append('excerpt', excerpt)
    fd.append(
      'ingredients',
      JSON.stringify(ingredients.filter(i => i.name.trim()))
    )
    fd.append(
      'instructions',
      JSON.stringify(instructions.filter(i => i.trim()))
    )
    if (image) fd.append('image', image)

    const token = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content')

    const res = await fetch('/api/community-recipes', {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': token || '' },
      body: fd
    })

    if (res.ok) {
      setMessage('Recipe submitted for review.')
      onSubmitted()

      setTimeout(() => {
        onClose()
      }, 1800)
    } else {
      setMessage('Submission failed.')
    }

    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="font-semibold text-gray-900">
            Share a Recipe
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4 p-5">

          {/* Title */}
          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Recipe title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          {/* Description */}
          <textarea
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Short description"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={3}
            required
          />

          {/* Ingredients */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Ingredients
            </label>

            <div className="mt-2 space-y-2">
              {ingredients.map((row, i) => (
                <div key={i} className="flex gap-2">

                  {/* Amount */}
                  <input
                    className="w-16 rounded border px-2 py-1 text-sm"
                    placeholder="1/2"
                    value={row.amount}
                    onChange={e =>
                      updateIngredient(i, 'amount', e.target.value)
                    }
                  />

                  {/* Unit */}
                  <select
                    className="w-20 rounded border px-2 py-1 text-sm"
                    value={row.unit}
                    onChange={e =>
                      updateIngredient(i, 'unit', e.target.value)
                    }
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>
                        {u || '—'}
                      </option>
                    ))}
                  </select>

                  {/* Name */}
                  <input
                    className="flex-1 rounded border px-2 py-1 text-sm"
                    placeholder="flour"
                    value={row.name}
                    onChange={e =>
                      updateIngredient(i, 'name', e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-xs text-orange-600 hover:underline"
            >
              + Add ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Instructions
            </label>

            <div className="mt-2 space-y-2">
              {instructions.map((step, i) => (
                <textarea
                  key={i}
                  className="w-full rounded border px-2 py-1 text-sm"
                  placeholder={`Step ${i + 1}`}
                  value={step}
                  onChange={e =>
                    updateInstruction(i, e.target.value)
                  }
                  rows={2}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addInstruction}
              className="mt-2 text-xs text-orange-600 hover:underline"
            >
              + Add step
            </button>
          </div>

          {/* Image */}
          <input
            type="file"
            accept="image/*"
            onChange={e =>
              setImage(e.target.files?.[0] ?? null)
            }
            className="text-xs text-gray-500"
          />

          {/* Submit */}
          <div className="flex justify-end">
            <button
              disabled={submitting}
              className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit Recipe'}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-sm ${
                message.includes('submitted')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  )
}
