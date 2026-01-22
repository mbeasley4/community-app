import { usePage, Link } from '@inertiajs/react'

type User = {
  id: number
  name: string
  email: string
  avatar_url: string | null
  posts_count?: number
  recipes_count?: number 
}

type PageProps = {
  auth?: {
    user?: User | null
  }
}

export default function ProfileSidebar() {
  const { props } = usePage<PageProps>()
  const user = props.auth?.user

  if (!user) return null

  // Build initials fallback
  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="rounded-xl border bg-white p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            {initials}
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="border-t" />

      {/* Stats */}
      <div className="grid grid-cols-3 text-center text-sm">
        <div>
          <p className="font-semibold text-gray-900">{user.posts_count ?? 0}</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">45</p>
          <p className="text-xs text-gray-500">Days</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user.recipes_count ?? 0}</p>
          <p className="text-xs text-gray-500">Recipes</p>
        </div>
      </div>

      <div className="border-t" />

      {/* Nav */}
      <nav className="space-y-1 text-sm">
        <Link
          href="/settings/profile"
          className="block rounded-md px-2 py-2 text-gray-700 hover:bg-gray-100"
        >
          Profile Settings
        </Link>
      </nav>
    </div>
  )
}
