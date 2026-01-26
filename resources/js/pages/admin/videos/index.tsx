import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { Link, router, usePage } from '@inertiajs/react'

export default function VideosIndex({ videos }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  return (
    <CommunityLayoutNoRight>
      <div className="mx-auto max-w-5xl px-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Videos
          </h1>

          <Link
            href="/admin/videos/create"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-700 transition"
          >
            New Video
          </Link>
        </div>

        {/* Flash */}
        {flash?.success && (
          <div className="rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        {/* Video List */}
        <div className="space-y-3">
          {videos.map(video => (
            <div
              key={video.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >

              {/* Left */}
              <div>
                <div className="font-medium text-gray-900">
                  {video.title}
                </div>
                <div className="text-sm text-gray-500">
                  YouTube ID: {video.youtube_video_id}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">

                <Link
                  href={`/admin/videos/${video.id}/edit`}
                  className="rounded-md border border-orange-600 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => router.delete(`/admin/videos/${video.id}`)}
                  className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-sm text-gray-500">
            No videos yet. Click “New Video” to add one.
          </div>
        )}

      </div>
    </CommunityLayoutNoRight>
  )
}
