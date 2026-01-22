import LectureForm from './lecture-form'
import { Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function Create({ course }) {
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
          New Lecture — {course.title}
        </h1>

        <LectureForm course={course} />
      </div>
    </CommunityLayoutNoRight>
  )
}
