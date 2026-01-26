import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { useEffect, useState } from 'react'
import { CheckCircle, Lock, Clock } from "lucide-react";


type Lecture = {
  id: number
  title: string
  youtube_video_id?: string | null
  video_url?: string | null
  transcript: string | null
  image: string | null
  position: number
  completed: boolean
  in_progress: boolean
  unlocked: boolean
  duration_seconds?: number | null
}

type Course = {
  id: number
  title: string
  description: string
  image: string | null
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: any
  }
}

const csrfToken =
  document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.content ?? ''

export default function CourseShow({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null)
  const [loading, setLoading] = useState(true)

  const loadCourse = async () => {
    const res = await fetch(`/api/courses/${courseId}`, {
      headers: { Accept: 'application/json' },
    })
    const data = await res.json()

    setCourse(data.course)
    setLectures(data.lectures)

    const firstPlayable =
      data.lectures.find((l: Lecture) => l.unlocked && !l.completed) ??
      data.lectures.find((l: Lecture) => l.unlocked) ??
      null

    setActiveLecture(firstPlayable)
  }

  useEffect(() => {
    let mounted = true
    loadCourse().finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [courseId])

  // ---------- Progress API ----------
  const markWatched = async (lectureId: number, seconds: number) => {
    await fetch(`/api/lectures/${lectureId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json',
      },
      body: JSON.stringify({ watched_seconds: seconds }),
    })

    await loadCourse()
  }

  // ---------- YouTube Player ----------
  useEffect(() => {
    if (!activeLecture?.youtube_video_id) return
    if (!activeLecture.duration_seconds) return

    // Load YouTube API if not loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }

    let player: any
    let interval: any

    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('yt-player', {
        videoId: activeLecture.youtube_video_id,
        events: {
          onStateChange: (event: any) => {
            const YTState = window.YT.PlayerState

            // Start tracking when playing
            if (event.data === YTState.PLAYING) {
              interval = setInterval(() => {
                const current = Math.floor(player.getCurrentTime())
                const duration = activeLecture.duration_seconds!

                if (current >= duration - 5) {
                  markWatched(activeLecture.id, current)
                  clearInterval(interval)
                }
              }, 2000)
            }

            // Failsafe on ended
            if (event.data === YTState.ENDED) {
              markWatched(activeLecture.id, activeLecture.duration_seconds!)
              clearInterval(interval)
            }
          },
        },
      })
    }

    return () => {
      if (interval) clearInterval(interval)
      if (player?.destroy) player.destroy()
    }
  }, [activeLecture])

  // ---------- Manual Mark Complete fallback ----------
  const markComplete = async (lectureId: number) => {
    await markWatched(lectureId, activeLecture?.duration_seconds ?? 0)
  }

  if (loading || !course) {
    return <div className="p-6 text-gray-600">Loading course...</div>
  }

  const completedCount = lectures.filter(l => l.completed).length

  return (
    <CommunityLayoutNoRight>
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Main Player */}
        <main className="md:col-span-2 space-y-6">

          {activeLecture ? (
            <>
              <div className="aspect-video rounded-xl overflow-hidden border bg-black">
                <div id="yt-player" className="w-full h-full"></div>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {activeLecture.title}
                </h2>

                {!activeLecture.completed && activeLecture.unlocked && (
                  <button
                    onClick={() => markComplete(activeLecture.id)}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Mark Complete
                  </button>
                )}
              </div>

              {activeLecture.transcript && (
                <div className="rounded-xl border bg-white p-4 text-sm text-gray-700 whitespace-pre-line">
                  {activeLecture.transcript}
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">No lecture available.</div>
          )}

        </main>

        {/* Sidebar */}
        <aside className="space-y-4">
          <img
            src={course.image ? course.image : '/placeholder.png'}
            className="rounded-xl border"
            alt={course.title}
          />

          <h1 className="text-xl font-semibold">{course.title}</h1>
          <p className="text-sm text-gray-600">{course.description}</p>

          <div className="text-sm text-gray-500">
            Progress: {completedCount} / {lectures.length} completed
          </div>

          <ul className="space-y-2 pt-3">
            {lectures.map(lecture => (
              <li key={lecture.id}>
                <button
                  disabled={!lecture.unlocked}
                  onClick={() => setActiveLecture(lecture)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm border transition
                    ${
                      lecture.unlocked
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                    ${lecture.completed ? 'border-green-400' : 'border-gray-200'}
                  `}
                >
                  {lecture.position}. {lecture.title}
                  <span className="ml-2 inline-flex gap-1 align-middle">
                    {lecture.completed && <CheckCircle className="w-4 h-4" />}
                    {lecture.in_progress && <Clock className="w-4 h-4" />}
                    {!lecture.unlocked && <Lock className="w-4 h-4" />}
                  </span>

                </button>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </CommunityLayoutNoRight>
  )
}