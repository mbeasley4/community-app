import { useForm } from '@inertiajs/react'

export default function VideoForm({ video }: { video?: any }) {
  const form = useForm({
    title: video?.title || '',
    youtube_video_id: video?.youtube_video_id || '',
    description: video?.description || '',
  })

  function handleSubmit(e) {
    e.preventDefault()

    if (video) {
      form.put(`/admin/videos/${video.id}`)
    } else {
      form.post('/admin/videos')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={form.data.title}
          onChange={e => form.setData('title', e.target.value)}
        />
        {form.errors.title && (
          <p className="text-sm text-red-600">{form.errors.title}</p>
        )}
      </div>

      {/* YouTube ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          YouTube Video ID
        </label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="dQw4w9WgXcQ"
          value={form.data.youtube_video_id}
          onChange={e => form.setData('youtube_video_id', e.target.value)}
        />
        {form.errors.youtube_video_id && (
          <p className="text-sm text-red-600">
            {form.errors.youtube_video_id}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 w-full border rounded px-3 py-2"
          rows={4}
          value={form.data.description}
          onChange={e => form.setData('description', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={form.processing}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {form.processing ? 'Saving...' : 'Save Video'}
      </button>
    </form>
  )
}
