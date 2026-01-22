import { useForm } from '@inertiajs/react'

export default function LectureForm({ course, lecture }) {
  const form = useForm({
    title: lecture?.title ?? '',
    description: lecture?.description ?? '',
    youtube_video_id: lecture?.youtube_video_id ?? '',
    position: lecture?.position ?? 1,
    transcript: lecture?.transcript ?? '',
    duration_seconds: lecture?.duration_seconds ?? '',
    image: null as File | null,
  })

  function submit(e) {
    e.preventDefault()

    if (lecture) {
      form.post(`/admin/lectures/${lecture.id}?_method=PUT`)
    } else {
      form.post(`/admin/courses/${course.id}/lectures`)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">

      <div>
        <label className="text-sm">Title</label>
        <input
          value={form.data.title}
          onChange={e => form.setData('title', e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
        {form.errors.title && (
          <p className="text-sm text-red-600">{form.errors.title}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Description</label>
        <textarea
          value={form.data.description}
          onChange={e => form.setData('description', e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm">YouTube Video ID</label>
        <input
          value={form.data.youtube_video_id}
          onChange={e => form.setData('youtube_video_id', e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
        {form.errors.youtube_video_id && (
          <p className="text-sm text-red-600">{form.errors.youtube_video_id}</p>
        )}
      </div>

      <div>
        <label className="text-sm">Position</label>
        <input
          type="number"
          value={form.data.position}
          onChange={e => form.setData('position', Number(e.target.value))}
          className="border w-full px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm">Duration (seconds)</label>
        <input
          type="number"
          value={form.data.duration_seconds}
          onChange={e => form.setData('duration_seconds', Number(e.target.value))}
          className="border w-full px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm">Transcript</label>
        <textarea
          value={form.data.transcript}
          onChange={e => form.setData('transcript', e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="text-sm">Lecture Image</label>
        <input
          type="file"
          onChange={e => form.setData('image', e.target.files?.[0] ?? null)}
        />
      </div>

      <button
        disabled={form.processing}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Save Lecture
      </button>
    </form>
  )
}
