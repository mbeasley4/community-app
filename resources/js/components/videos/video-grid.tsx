import { useEffect, useState } from 'react'
import { Video } from '@/types/video'


export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => setVideos(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-gray-500">Loading videos…</p>
  }

  return (
    <>
      <div className="p-3">
        <h1 className="text-3xl font-semibold text-gray-900">
          Video Library
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Curated coaching, education, and guidance videos.
        </p>
      </div>

      {/* ✅ True two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map(video => (
          <div key={video.id} className="space-y-3">
            <iframe
              className="w-full aspect-video rounded-lg"
              src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
              allowFullScreen
            />
            <h3 className="font-semibold text-gray-900">
              {video.title}
            </h3>
            {video.description && (
              <p className="text-sm text-gray-600">
                {video.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
