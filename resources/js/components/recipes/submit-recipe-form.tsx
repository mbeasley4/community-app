import { useState } from 'react'

export default function SubmitRecipeForm({
  onSubmitted
}: {
  onSubmitted: () => void
}) {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function handleFile(file: File) {
    setImage(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(true)
  }

  function onDragLeave() {
    setDragActive(false)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('excerpt', excerpt)
    if (image) formData.append('image', image)

    const token = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content')

    const res = await fetch('/api/community-recipes', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': token || ''
      },
      body: formData
    })

    const json = await res.json()

    if (!res.ok) {
      setMessage(
        json.errors?.title?.[0] ||
        json.errors?.excerpt?.[0] ||
        json.errors?.image?.[0] ||
        json.message ||
        'Submission failed'
      )
    } else {
      setTitle('')
      setExcerpt('')
      setImage(null)
      setMessage('Recipe submitted for review')
      onSubmitted()
    }

    setSubmitting(false)
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h3 className="font-semibold text-gray-900">
        Share a Recipe
      </h3>

      {/* Title */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Recipe title"
        className="w-full rounded border px-3 py-2 text-sm"
        required
      />

      {/* Excerpt */}
      <textarea
        value={excerpt}
        onChange={e => setExcerpt(e.target.value)}
        placeholder="Short description"
        className="w-full rounded border px-3 py-2 text-sm"
        rows={3}
        required
      />

      {/* Drag + Drop Image Upload */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 text-sm transition ${
          dragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300'
        }`}
        onClick={() => document.getElementById('recipe-image')?.click()}
      >
        <input
          id="recipe-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {!image && (
          <p className="text-gray-600">
            Drag & drop an image here, or click to browse  
            <span className="block text-xs text-gray-400">
              Max size: 2MB
            </span>
          </p>
        )}

        {image && (
          <p className="text-gray-700">
            Selected: <span className="font-medium">{image.name}</span>
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        disabled={submitting}
        className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit Recipe'}
      </button>

      {message && (
        <p className="text-sm text-gray-600">
          {message}
        </p>
      )}
    </form>
  )
}
