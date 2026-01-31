import { useEffect, useRef, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { MessageCircle, Trash2 } from 'lucide-react'
import ReactionSummary from './reaction-summary'
import { REACTIONS } from '@/config/reactions'
import { Post } from '@/types/index'

type AuthUser = {
  id: number
  name: string
}

type PageProps = {
  auth: {
    user: AuthUser | null
  }
}

export default function PostFeed({
  onVisibleCountChange,
}: {
  onVisibleCountChange?: (n: number) => void
}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [images, setImages] = useState<File[]>([])
  const [commentBodies, setCommentBodies] = useState<Record<number, string>>({})
  const [openCommentBox, setOpenCommentBox] = useState<Record<number, boolean>>({})

  // 🔥 MOBILE REACTION STATE
  const [openReactionPostId, setOpenReactionPostId] = useState<number | null>(
    null
  )
  const longPressTimer = useRef<number | null>(null)

  const { auth } = usePage<PageProps>().props
  const authUserId = auth.user?.id ?? 0

  const csrfToken =
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
    ''

  /* ---------------- LOAD POSTS ---------------- */

  const refreshPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      const list = Array.isArray(data.data) ? data.data : []

      setPosts(list)

      const myCount = list.filter((p) => p.user.id === authUserId).length
      onVisibleCountChange?.(myCount)
    } catch {
      setPosts([])
      onVisibleCountChange?.(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshPosts()
  }, [])

  /* ---------------- CREATE POST ---------------- */

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('body', body)
    images.forEach((img) => formData.append('images[]', img))

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error()

      setPosts((prev) => [data, ...prev])
      setBody('')
      setImages([])
    } catch {
      setError('Could not create post')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- REACT ---------------- */

  const reactToPost = async (postId: number, type: string) => {
    const res = await fetch(`/api/posts/${postId}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json',
      },
      body: JSON.stringify({ type }),
    })

    const data = await res.json()
    if (!res.ok) return

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, reaction_summary: data.reactionSummary }
          : p
      )
    )
  }

  /* ---------------- MOBILE LONG PRESS ---------------- */

  const handleReactionTouchStart = (postId: number) => {
    longPressTimer.current = window.setTimeout(() => {
      setOpenReactionPostId(postId)
    }, 500)
  }

  const handleReactionTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  useEffect(() => {
    const close = () => setOpenReactionPostId(null)
    document.addEventListener('touchstart', close)
    return () => document.removeEventListener('touchstart', close)
  }, [])

  /* ---------------- HELPERS ---------------- */

  const initials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return (
      <div className="space-y-4 px-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <section className="mx-auto px-0 lg:px-6 space-y-6">
      {posts.map((post) => {
        const DefaultReactionIcon = REACTIONS[0].Icon

        return (
          <article
            key={post.id}
            className="rounded-xl border bg-white p-5 shadow-sm space-y-3"
          >
            {/* BODY */}
            <p className="whitespace-pre-line text-gray-800">{post.body}</p>

            {/* ACTION BAR */}
            <div className="flex items-center gap-6 pt-2">
              {/* LIKE / REACTIONS */}
              <div className="relative inline-block">
                <button
                  type="button"
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600"
                  onClick={() =>
                    reactToPost(post.id, REACTIONS[0].type)
                  }
                  onTouchStart={() =>
                    handleReactionTouchStart(post.id)
                  }
                  onTouchEnd={handleReactionTouchEnd}
                  onMouseEnter={() =>
                    setOpenReactionPostId(post.id)
                  }
                  onMouseLeave={() =>
                    setOpenReactionPostId(null)
                  }
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                    <DefaultReactionIcon className="h-4 w-4 text-gray-600" />
                  </span>
                  Like
                </button>

                {openReactionPostId === post.id && (
                  <div className="absolute left-0 top-full mt-2 flex bg-white border rounded-full shadow px-2 py-1 gap-2 z-20">
                    {REACTIONS.map((r) => (
                      <button
                        key={r.type}
                        onClick={() => {
                          reactToPost(post.id, r.type)
                          setOpenReactionPostId(null)
                        }}
                        type="button"
                        className="hover:scale-125 transition"
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${r.bg}`}
                        >
                          <r.Icon className="h-4 w-4 text-white" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* COMMENT */}
              <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600">
                <MessageCircle className="h-4 w-4" />
                Comment
              </button>

              {/* REMOVE */}
              {post.user.id === authUserId && (
                <button className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>

            {/* SUMMARY */}
            <ReactionSummary
              reactionSummary={post.reaction_summary}
              onReact={(type) => reactToPost(post.id, type)}
            />
          </article>
        )
      })}
    </section>
  )
}
