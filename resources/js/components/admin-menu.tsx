import { Link, usePage } from '@inertiajs/react'
import { SharedData } from '@/types'

export default function AdminMenu() {
  const { auth } = usePage<SharedData>().props

  // If not logged in or not admin — render nothing
  if (!auth.user || !auth.user.roles?.includes('admin')) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white mb-2 p-4">
      <h3 className="font-semibold text-sm mb-3">Admin</h3>

      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/admin/users"
            className="text-orange-600 hover:underline"
          >
            Manage Users
          </Link>
        </li>

        <li>
          <Link
            href="/admin/ads"
            className="text-orange-600 hover:underline"
          >
            Manage Advertisements
          </Link>
        </li>
        <li>
          <Link
            href="/admin/courses"
            className="text-orange-600 hover:underline"
          >
            Manage Courses
          </Link>
        </li>
      </ul>
    </div>
  )
}