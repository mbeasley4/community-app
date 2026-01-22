import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { Link, router, usePage } from '@inertiajs/react'

export default function CoursesIndex({ courses }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  return (
    <CommunityLayoutNoRight>
          <div className="px-6">

        <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-semibold">Courses</h1>

            <Link
            href="/admin/courses/create"
            className="bg-orange-500 text-white px-4 py-2 rounded"
            >
            New Course
            </Link>
        </div>

        {flash?.success && (
            <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
            {flash.success}
            </div>
        )}

        {courses.map(course => (
            <div
            key={course.id}
            className="border rounded p-4 mb-3 flex justify-between items-center"
            >
            <div>
                <div className="font-medium">{course.title}</div>
                <div className="text-sm text-gray-500">
                {course.description?.substring(0, 80)}
                </div>
            </div>

            <div className="flex gap-4">
                <Link
                href={`/admin/courses/${course.id}/lectures`}
                className="text-blue-600 hover:underline"
                >
                Lectures
                </Link>

                <Link
                href={`/admin/courses/${course.id}/edit`}
                className="text-orange-600 hover:underline"
                >
                Edit
                </Link>

                <button
                onClick={() => router.delete(`/admin/courses/${course.id}`)}
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
