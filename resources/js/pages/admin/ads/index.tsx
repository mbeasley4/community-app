import { Link, router } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function AdsIndex({ ads }) {
  return (
    <CommunityLayoutNoRight>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Advertisements</h1>
          <Link href="/admin/ads/create" className="bg-orange-500 text-white px-4 py-2 rounded">
            New Ad
          </Link>
        </div>

        {ads.map(ad => (
          <div key={ad.id} className="border rounded p-4 flex items-center justify-between mb-3">

            <div className="flex items-center gap-4">
              <img src={ad.image_url} className="h-16 rounded" />
              <div>
                <div className="font-medium">{ad.title}</div>
                <div className="text-xs text-gray-500">Position: {ad.position}</div>
                <div className="text-xs">{ad.is_active ? 'Active' : 'Hidden'}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/admin/ads/${ad.id}/edit`} className="text-orange-600">Edit</Link>
              <button
                onClick={() => router.delete(`/admin/ads/${ad.id}`)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </CommunityLayoutNoRight>
  )
}
