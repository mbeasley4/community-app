import CourseForm from './course-form'
import { Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function Create() {
  return (
    <CommunityLayoutNoRight>
        <div className="px-6">

        <Link href="/admin/courses" className="text-sm text-gray-500 hover:underline">
          ← Back to courses
        </Link>

        <h1 className="text-2xl font-semibold mt-4 mb-6">
          Create Course
        </h1>

        <CourseForm />
      </div>
    </CommunityLayoutNoRight>
  )
}
