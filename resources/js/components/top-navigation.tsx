import AppLogo from '@/components/app-logo'
import NotificationBell from '@/components/notification-bell'
import { Link, usePage } from '@inertiajs/react'

type User = {
  name: string
  avatar_url: string | null
}

type PageProps = {
  auth: {
    user: User | null
  }
}

export default function TopNavigation() {
  const { url, props } = usePage<PageProps>()
  const user = props.auth.user

  const isActive = (path: string) =>
    url === path || url.startsWith(path + '/')

  const base = 'text-sm transition'
  const inactive = 'text-gray-600 hover:text-gray-900'
  const active = 'text-gray-900 font-medium border-b-2 border-gray-900'

  // Build initials fallback
  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <div className="py-2">
          <AppLogo />
        </div>

        <nav className="flex items-center gap-6">

          <Link
            href="/community"
            className={`${base} ${isActive('/community') ? active : inactive}`}
          >
            Community
          </Link>

          <Link
            href="/recipes"
            className={`${base} ${isActive('/recipes') ? active : inactive}`}
          >
            Recipes
          </Link>

          <Link
            href="/events"
            className={`${base} ${isActive('/events') ? active : inactive}`}
          >
            Events
          </Link>

          <Link
            href="/videos"
            className={`${base} ${isActive('/videos') ? active : inactive}`}
          >
            Videos
          </Link>

          <Link
            href="/courses"
            className={`${base} ${isActive('/courses') ? active : inactive}`}
          >
            Courses
          </Link>

          {/* Notification Bell */}
          <NotificationBell count={3} />

          {/* Avatar → Profile */}
          <div className="flex gap-1">
            {user && (
              <Link
                href="/settings/profile"
                className="flex items-center"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {initials}
                  </div>
                )}
              </Link>
            )}

            {/* Logout */}
            <Link
              href="/logout"
              method="post"
              as="button"
              className={`${base} ${inactive}`}
            >
              Logout
            </Link>
          </div>

        </nav>
      </div>
    </header>
  )
}
