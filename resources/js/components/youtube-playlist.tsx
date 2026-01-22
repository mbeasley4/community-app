import { useEffect, useState } from 'react'

type Video = {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: {
        url: string
      }
    }
    resourceId: {
      videoId: string
    }
  }
}

export default function YouTubePlaylist({ playlistId }: { playlistId: string }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/youtube/playlist/${playlistId}`)
      .then(res => res.json())
      .then(data => setVideos(data.items))
      .finally(() => setLoading(false))
  }, [playlistId])

  if (loading) {
    return <p className="text-gray-500">Loading videos…</p>
  }

  return (
    <>
    <div className="p-3">
      <h1 className="text-3xl font-semibold text-gray-900">YouTube Video List</h1>
      <p className="mt-1 text-sm text-gray-500">The Whole30 Video List is a curated collection of coaching, education, and guidance videos designed to support participants throughout their program journey. Organized for easy browsing, it helps users quickly find the right content at the right time.</p>
    </div>
    <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
      {videos.map(video => {
        const videoId = video.snippet.resourceId.videoId

        return (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}`}
            allowFullScreen
            />
        )
      })}
    </div>
    </>
  )
}
