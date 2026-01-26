import { Link } from '@inertiajs/react'
import { useState } from 'react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

type Purchase = {
  id: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  purchased_at: string | null
}

type Role = {
  name: string
}
 
type User = {
  id: number
  name: string
  email: string
  last_login_at: string | null
  roles: Role[]
  latest_purchase?: Purchase | null
}

type PaginationLink = {
  url: string | null
  label: string
  active: boolean
}

type UsersResponse = {
  data: User[]
  links: PaginationLink[]
}

export default function UsersIndex({ users }: { users: UsersResponse }) {
  const [tab, setTab] = useState<'customers' | 'system'>('customers')

  // Identify system users
  const isSystemUser = (user: User) =>
    user.roles.some(r => r.name === 'admin' || r.name === 'instructor')

  const customers = users.data.filter(u => !isSystemUser(u))
  const systemUsers = users.data.filter(u => isSystemUser(u))

  const activeUsers = tab === 'customers' ? customers : systemUsers

  return (
    <CommunityLayoutNoRight>
      <div className="px-6 py-6 space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            User Management
          </h1>

          <div className="text-sm text-gray-500">
            {activeUsers.length} users shown
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-orange-600">
          <button
            onClick={() => setTab('customers')}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
              tab === 'customers'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Customers
          </button>

          <button
            onClick={() => setTab('system')}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
              tab === 'system'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Admins {/* & Instructors */}
          </button>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">

              {/* Sticky Header */}
              <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-center font-medium">Role</th>
                  <th className="px-4 py-3 text-center font-medium">Last Login</th>

                  {/* Purchase columns only for customers */}
                  {tab === 'customers' && (
                    <>
                      <th className="px-4 py-3 text-center font-medium">Purchase Status</th>
                      <th className="px-4 py-3 text-center font-medium">Last Purchase</th>
                    </>
                  )}

                  <th className="px-4 py-3 text-right font-medium"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {activeUsers.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-600">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-center">
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {user.roles[0]?.name ?? 'customer'}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {user.last_login_at
                        ? new Date(user.last_login_at).toLocaleDateString()
                        : 'Never'}
                    </td>

                    {/* Purchase columns only on Customers tab */}
                    {tab === 'customers' && (
                      <>
                        {/* Purchase Status */}
                        <td className="px-4 py-3 text-center">
                          {user.latest_purchase ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                user.latest_purchase.status === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : user.latest_purchase.status === 'refunded'
                                  ? 'bg-red-100 text-red-700'
                                  : user.latest_purchase.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {user.latest_purchase.status}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        {/* Last Purchase Date */}
                        <td className="px-4 py-3 text-center text-xs text-gray-500">
                          {user.latest_purchase?.purchased_at
                            ? new Date(user.latest_purchase.purchased_at).toLocaleDateString()
                            : '—'}
                        </td>
                      </>
                    )}

                    {/* Edit */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-orange-600 font-medium hover:text-orange-700 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Pagination (still driven by backend pagination) */}
        <div className="mt-6 flex flex-wrap gap-2">
          {users.links.map(link => (
            <Link
              key={link.label}
              href={link.url ?? '#'}
              className={`rounded border px-3 py-1 text-sm transition ${
                link.active
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>

      </div>
    </CommunityLayoutNoRight>
  )
}
