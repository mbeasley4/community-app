import { Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function UsersIndex({ users }) {
  return (
    <CommunityLayoutNoRight>
      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Last Login</th>
              <th className="p-2"></th>
            </tr>
          </thead>

          <tbody>
            {users.data.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 text-center">
                  {user.roles[0]?.name ?? '—'}
                </td>
                <td className="p-2 text-center">
                  {user.last_login_at ?? 'Never'}
                </td>
                <td className="p-2 text-right">
                  <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="text-orange-600 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-6 flex gap-2">
          {users.links.map(link => (
            <Link
              key={link.url}
              href={link.url ?? '#'}
              className={`px-3 py-1 border rounded ${link.active ? 'bg-orange-500 text-white' : ''}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </CommunityLayoutNoRight>
  )
}
