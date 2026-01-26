import { Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function AdminRecipes({ recipes }) {
  return (
    <CommunityLayoutNoRight>
      <div className="px-6 space-y-6">

        <h1 className="text-2xl font-semibold text-gray-900">
          Recipe Moderation
        </h1>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              {/* Header */}
              <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Title
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Submitted By
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-gray-100">
                {recipes.data.map(r => (
                  <tr
                    key={r.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {r.title}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700">
                      {r.user.name}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : r.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-gray-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/recipes/${r.id}`}
                        className="text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap gap-2">
          {recipes.links.map(l => (
            <Link
              key={l.label}
              href={l.url ?? '#'}
              className={`rounded-md border px-3 py-1 text-sm ${
                l.active
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          ))}
        </div>

      </div>
    </CommunityLayoutNoRight>
  )
}
