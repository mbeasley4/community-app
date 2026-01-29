import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'
import CommunityLayout from '@/layouts/community-layout'
import { Advertisement } from '@/types/advertisement'

type Course = {
  id: number
  title: string
  description?: string
  image?: string
  slug: string
}

type Props = {
  ads: Advertisement[]
}

export default function CoursePage({ ads }: Props) {
  const [courses, setCourses] = useState<Course[]>([])

  const { auth } = usePage().props as any
  const user = auth?.user

  const purchasedCourses = user?.purchased_courses ?? []
  const hasCohort = !!user?.cohort

  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(setCourses)
  }, [])

  function ownsCourse(courseId: number) {
    return purchasedCourses.some((c: any) => c.id === courseId)
  }

  return (
    <CommunityLayout ads={ads}>
      <div className="max-w-6xl mx-auto px-0 lg:px-6">
        <h1 className="text-3xl font-semibold mb-3">Courses</h1>

        <p className="text-gray-600 mb-8 max-w-3xl">
          These courses provide step-by-step guidance, expert insights, and practical tools to help participants stay on track, build confidence, and get the most out of their program experience.
        </p>

        <div className="space-y-4">
          {courses.map(course => {
            const owned = ownsCourse(course.id)

            return (
              <div
                key={course.id}
                className="flex flex-col lg:flex-row items-center gap-5 rounded-xl border bg-white overflow-hidden"
              >
                {course.image && (
                  <img
                    src={course.image}
                    className="h-auto w-full lg:h-60 lg:w-60 object-cover flex-shrink-0"
                    alt={course.title}
                  />
                )}

                <div className="px-4 pb-12 lg:pb-0 lg:py-4 lg:pr-4 flex-1">
                  <h2 className="font-semibold text-lg">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-6">
                    {course.description}
                  </p>
                  <div className="text-sm text-gray-600 mt-4">
                  {owned && (
                    <a
                      href={`/courses/?product=${course.slug}`} 
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      View Course
                    </a>
                  )}

                  {!owned && hasCohort && (
                    <a
                      href={`/checkout?product=${course.slug}`} 
                      className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
                    >
                      Buy Course
                    </a>
                  )}

                  {!owned && !hasCohort && (
                    <a
                      href="/pricing"
                      className="px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition"
                    >
                      Learn More
                    </a>
                  )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </CommunityLayout>
  )
}
