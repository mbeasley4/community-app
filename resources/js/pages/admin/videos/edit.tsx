import VideoForm from './video-form'
import { Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function Edit({ video }) {
  return (
    <CommunityLayoutNoRight>
      <div className="px-6">

        <Link href="/admin/videos" className="text-sm text-gray-500 hover:underline">
          ← Back to videos
        </Link>

        <h1 className="text-2xl font-semibold mt-4 mb-6">
          Edit Video
        </h1>

        <VideoForm video={video} />

      </div>
    </CommunityLayoutNoRight>
  )
}
