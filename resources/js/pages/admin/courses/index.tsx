import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { Link, router, usePage } from '@inertiajs/react'

export default function CoursesIndex({ courses }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  return (
    <CommunityLayoutNoRight>
      <div className="mx-auto max-w-5xl px-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Courses
          </h1>

          <Link
            href="/admin/courses/create"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-700 transition"
          >
            New Course
          </Link>
        </div>

        {/* Flash */}
        {flash?.success && (
          <div className="rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        {/* Course List */}
        <div className="space-y-3">
          {courses.map(course => (
            <div
              key={course.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >

              {/* Left Side */}
              <div className="flex items-center gap-4">

                {/* Course Image */}
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-16 w-16 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg border bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    No Image
                  </div>
                )}

                {/* Title + Description */}
                <div>
                  <div className="font-medium text-gray-900">
                    {course.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.description?.substring(0, 80)}
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">

                <Link
                  href={`/admin/courses/${course.id}/lectures`}
                  className="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                >
                  Lectures
                </Link>

                <Link
                  href={`/admin/courses/${course.id}/edit`}
                  className="rounded-md border border-orange-600 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => router.delete(`/admin/courses/${course.id}`)}
                  className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </CommunityLayoutNoRight>
  )
}
