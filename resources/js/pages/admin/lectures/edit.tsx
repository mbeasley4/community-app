import LectureForm from './lecture-form'
import { Link, usePage } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function Edit({ lecture, course }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  return (
    <CommunityLayoutNoRight>
        <div className="px-6">

        <Link
          href={`/admin/courses/${course.id}/lectures`}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to lectures
        </Link>

        <h1 className="text-2xl font-semibold mt-4 mb-6">
          Edit Lecture — {lecture.title}
        </h1>

        {flash?.success && (
          <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        <LectureForm course={course} lecture={lecture} />
      </div>
    </CommunityLayoutNoRight>
  )
}
