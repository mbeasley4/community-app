import { useForm } from '@inertiajs/react'

export default function CourseForm({ course }) {
  const form = useForm({
    title: course?.title ?? '',
    description: course?.description ?? '',
    image: null as File | null,
  })

  function submit(e) {
    e.preventDefault()

    if (course) {
      form.post(`/admin/courses/${course.id}?_method=PUT`)
    } else {
      form.post('/admin/courses')
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
        <label className="text-sm">Course Image</label>
        <input
          type="file"
          onChange={e => form.setData('image', e.target.files?.[0] ?? null)}
        />
      </div>

      <button
        disabled={form.processing}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Save Course
      </button>
    </form>
  )
}
