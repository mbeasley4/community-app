import { Link, usePage } from '@inertiajs/react'
import { SharedData } from '@/types'

export default function AdminMenu() {
  const page = usePage<SharedData>()
  const { auth } = page.props
  const url = page.url


  // Only admins see menu
  if (!auth.user || !auth.user.roles?.includes('admin')) {
    return null
  }

  const isActive = (path: string) => url.startsWith(path) 

  const items = [
    { label: 'Manage Users', href: '/admin/users' },
    { label: 'Manage Courses', href: '/admin/courses' },
    { label: 'Manage Events', href: '/admin/events' },
    { label: 'Manage Recipes', href: '/admin/recipes' },
    { label: 'Manage Advertisements', href: '/admin/ads' },
    { label: 'Manage Videos', href: '/admin/videos' }
  ]

  return (
    <div className="mb-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm">

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-700">
        Admin Panel
      </h3>

      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-orange-600 text-white shadow'
                  : 'text-gray-700 hover:bg-orange-100 hover:text-orange-700'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}
