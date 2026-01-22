import { useEffect, useState } from 'react'
import CommunityLayout from '@/layouts/community-layout'
import { Advertisement } from '@/types/advertisement'

type Course = {
  id: number
  title: string
  description?: string
  image?: string
}

export default function CourseIndex({ads,}:{ads: Advertisement[] }) {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(setCourses)
  }, [])

  return (
    <CommunityLayout ads={ads}>
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-semibold mb-3">Courses</h1>

        <p className="text-gray-600 mb-8 max-w-3xl">
          These courses provide step-by-step guidance, expert insights, and practical tools to help participants stay on track, build confidence, and get the most out of their program experience.
        </p>

        <div className="space-y-4">
          {courses.map(course => (
            <a
              key={course.id}
              href={`/courses/${course.id}`}
              className="flex items-center gap-5 rounded-xl border bg-white overflow-hidden hover:shadow transition"
            >
              {course.image && (
                <img
                  src={course.image}
                  className="h-40 w-48 object-cover flex-shrink-0"
                  alt={course.title}
                />
              )}

              <div className="py-4 pr-4">
                <h2 className="font-semibold text-lg">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </CommunityLayout>
  )
}
