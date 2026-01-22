import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { useEffect, useState } from 'react'

type Lecture = {
  id: number
  title: string
  youtube_video_id?: string | null
  video_url?: string | null

  transcript: string | null
  image: string | null
  position: number
  completed: boolean
  unlocked: boolean
}

type Course = {
  id: number
  title: string
  description: string
  image: string | null
}

/* =======================
   Helpers
======================= */

const csrfToken =
  document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.content ?? ''

// Accepts:
// - youtube id: dQw4w9WgXcQ
// - youtu.be/dQw4w9WgXcQ
// - youtube.com/watch?v=dQw4w9WgXcQ
// - youtube.com/embed/dQw4w9WgXcQ
const toYouTubeEmbed = (value?: string | null) => {
  if (!value) return null

  // If it already looks like an embed URL
  if (value.includes('youtube.com/embed/')) return value

  // Watch URL or short URL
  const match = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`

  // If it's just an ID (most common)
  if (/^[a-zA-Z0-9_-]{6,}$/.test(value)) {
    return `https://www.youtube.com/embed/${value}`
  }

  // fallback: try it as-is
  return value
}

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

  loadCourse().finally(() => {
    if (mounted) setLoading(false)
  })

  return () => {
    mounted = false
  }
}, [courseId])


  const markComplete = async (lectureId: number) => {
    await fetch(`/api/lectures/${lectureId}/complete`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json',
      },
    })

    await loadCourse()
  }

  if (loading || !course) {
    return <div className="p-6 text-gray-600">Loading course...</div>
  }

  const completedCount = lectures.filter(l => l.completed).length

  // ✅ Compute embed src from either youtube_video_id or video_url
  const embedSrc =
    toYouTubeEmbed(activeLecture?.youtube_video_id) ??
    toYouTubeEmbed(activeLecture?.video_url)

  return (
    <CommunityLayoutNoRight>
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Player */}
            <main className="md:col-span-2 space-y-6">
                {activeLecture ? (
                <>
                    {/* Video Player */}
                    <div className="aspect-video rounded-xl overflow-hidden border bg-black">
                    {embedSrc ? (
                        <iframe
                        key={embedSrc} // ✅ forces reload when switching lectures
                        src={embedSrc}
                        className="w-full h-full"
                        title={activeLecture.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/80 text-sm">
                        Missing YouTube video URL/ID for this lecture.
                        </div>
                    )}
                    </div>

                    <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{activeLecture.title}</h2>

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
                        {lecture.completed && ' ✅'}
                        {!lecture.unlocked && ' 🔒'}
                    </button>
                    </li>
                ))}
                </ul>
            </aside>
        </div>
    </CommunityLayoutNoRight>
  )
}
