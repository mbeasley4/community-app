import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { Link, router, usePage } from '@inertiajs/react'

export default function LecturesIndex({ course, lectures }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  return (
    <CommunityLayoutNoRight>
      <div className="px-6">

      <Link
        href="/admin/courses"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to courses
      </Link>

      <div className="flex justify-between mb-6 mt-4">
        <h1 className="text-2xl font-semibold">
          Lectures — {course.title}
        </h1>

        <Link
          href={`/admin/courses/${course.id}/lectures/create`}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          New Lecture
        </Link>
      </div>

      {flash?.success && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
          {flash.success}
        </div>
      )}

      {lectures.map(lecture => (
        <div
          key={lecture.id}
          className="border rounded p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <div className="font-medium">{lecture.title}</div>
            <div className="text-xs text-gray-500">
              Position: {lecture.position}
            </div>
            <div className="text-xs text-gray-500">
              Duration: {lecture.duration_seconds ?? 0}s
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/admin/lectures/${lecture.id}/edit`}
              className="text-orange-600 hover:underline"
            >
              Edit
            </Link>

            <button
              onClick={() => router.delete(`/admin/lectures/${lecture.id}`)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </CommunityLayoutNoRight>
  )
}
