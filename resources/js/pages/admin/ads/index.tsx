import { Link, router } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function AdsIndex({ ads }) {
  return (
    <CommunityLayoutNoRight>
      <div className="mx-auto max-w-5xl px-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Advertisements
          </h1>

          <Link
            href="/admin/ads/create"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-700 transition"
          >
            New Ad
          </Link>
        </div>

        {/* List */}
        <div className="space-y-3">
          {ads.map(ad => (
            <div
              key={ad.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >

              {/* Left */}
              <div className="flex items-center gap-4">
                <img
                  src={ad.image_url}
                  className="h-16 w-16 rounded-lg object-cover border"
                  alt={ad.title}
                />

                <div>
                  <div className="font-medium text-gray-900">
                    {ad.title}
                  </div>

                  <div className="text-xs text-gray-500">
                    Position: {ad.position}
                  </div>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      ad.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {ad.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">

                <Link
                  href={`/admin/ads/${ad.id}/edit`}
                  className="rounded-md border border-orange-600 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => router.delete(`/admin/ads/${ad.id}`)}
                  className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </CommunityLayoutNoRight>
  )
}
