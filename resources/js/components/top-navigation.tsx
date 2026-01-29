import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  const isActive = (path: string) =>
    url === path || url.startsWith(path + '/')

  const base = 'text-sm transition'
  const inactive = 'text-gray-600 hover:text-gray-900'
  const active = 'text-gray-900 font-medium'

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {[
        ['Community', '/community'],
        ['Recipes', '/recipes'],
        ['Events', '/events'],
        ['Videos', '/videos'],
        ['Courses', '/courses'],
      ].map(([label, href]) => (
        <Link
          key={href}
          href={href}
          onClick={onClick}
          className={`${base} ${
            isActive(href) ? active : inactive
          }`}
        >
          {label}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">

        {/* LEFT: Hamburger (mobile) + Logo */}
        <div className="flex items-center w-full lg:w-auto relative">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -ml-2 z-10"
            aria-label="Open menu" 
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Centered logo (mobile) */}
          <div className="absolute inset-0 flex justify-center lg:static lg:justify-start">
            <AppLogo />
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavLinks />

          <NotificationBell count={3} />

          <div className="flex items-center gap-2">
            {user && (
              <Link href="/settings/profile">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                    {initials}
                  </div>
                )}
              </Link>
            )}

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

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SLIDEOUT MENU */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r transform transition-transform duration-300 lg:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b">
          <AppLogo />
          <button onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-4">
          <NavLinks onClick={() => setOpen(false)} />

          <div className="pt-4 border-t">
            <Link
              href="/settings/profile"
              onClick={() => setOpen(false)}
              className={`${base} ${inactive}`}
            >
              Profile
            </Link>

            <Link
              href="/logout"
              method="post"
              as="button"
              className={`${base} ${inactive} mt-2 text-left`}
            >
              Logout
            </Link>
          </div>
        </nav>
      </aside>
    </header>
  )
}
