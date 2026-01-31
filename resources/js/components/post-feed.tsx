import { useEffect, useRef, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { MessageCircle, Trash2 } from 'lucide-react'
import ReactionSummary from './reaction-summary'
import { REACTIONS } from '@/config/reactions'
import { Post } from '@/types'

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

  /* 🔥 REACTION STATE */
  const [openReactionPostId, setOpenReactionPostId] = useState<number | null>(null)
  const [reactionPickerLocked, setReactionPickerLocked] = useState(false)

  const longPressTimer = useRef<number | null>(null)
  const didLongPress = useRef(false)

  const { auth } = usePage<PageProps>().props
  const authUserId = auth.user?.id ?? 0

  const csrfToken =
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''

  /* ---------------- LOAD POSTS ---------------- */

  const refreshPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      const list = Array.isArray(data.data) ? data.data : []

      setPosts(list)

      const myCount = list.filter(p => p.user.id === authUserId).length
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
    images.forEach(img => formData.append('images[]', img))

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

      setPosts(prev => [data, ...prev])
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

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, reaction_summary: data.reactionSummary }
          : p
      )
    )
  }

  /* ---------------- LONG PRESS HANDLERS ---------------- */

  const handleReactionTouchStart = (postId: number) => {
    didLongPress.current = false

    longPressTimer.current = window.setTimeout(() => {
      didLongPress.current = true
      setReactionPickerLocked(true)
      setOpenReactionPostId(postId)
    }, 500)
  }

  const handleReactionTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const unlockReactionPicker = () => {
    setTimeout(() => {
      setReactionPickerLocked(false)
    }, 250)
  }

  /* ---------------- CLOSE PICKER ON OUTSIDE TOUCH ---------------- */

  useEffect(() => {
    const close = (e: TouchEvent) => {
      if (reactionPickerLocked) return

      const target = e.target as HTMLElement
      if (target.closest('[data-reaction-picker]')) return

      setOpenReactionPostId(null)
    }

    document.addEventListener('touchstart', close)
    return () => document.removeEventListener('touchstart', close)
  }, [reactionPickerLocked])

  /* ---------------- HELPERS ---------------- */

  const initials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase()

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return (
      <div className="space-y-4 px-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <section className="mx-auto px-0 lg:px-6 space-y-6">

      {/* CREATE POST */}
      <form
        onSubmit={submitPost}
        className="rounded-xl border bg-white p-4 shadow-sm space-y-3"
      >
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full resize-none rounded-md border border-gray-300 p-2 text-gray-800"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e =>
            e.target.files && setImages(Array.from(e.target.files))
          }
          className="text-xs text-gray-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </form>

      {/* POSTS */}
      {posts.map(post => {
        const DefaultReaction = REACTIONS[0]

        return (
          <article
            key={post.id}
            className="rounded-xl border bg-white p-5 shadow-sm space-y-3"
          >
            {/* HEADER */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {post.user.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  className="h-9 w-9 rounded-full object-cover"
                  alt={post.user.name}
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700">
                  {initials(post.user.name)}
                </div>
              )}

              <div>
                <div className="font-semibold text-gray-800">
                  {post.user.name}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* BODY */}
            <p className="whitespace-pre-line text-gray-800">{post.body}</p>

            {/* SUMMARY */}
            <ReactionSummary
              reactionSummary={post.reaction_summary}
              onReact={type => reactToPost(post.id, type)}
            />

            {/* ACTION BAR */}
            <div className="flex items-center gap-6 pt-2">

              {/* LIKE / REACTIONS */}
              <div className="relative inline-block"
                onMouseEnter={() => setOpenReactionPostId(post.id)}
                onMouseLeave={() => setOpenReactionPostId(null)}
                >
                <button
                  type="button"
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                    <DefaultReaction.Icon className="h-4 w-4 text-gray-600" />
                  </span>
                  Like
                </button>

                {openReactionPostId === post.id && (
                  <div
                    data-reaction-picker
                    className="absolute left-0 top-full mt-0 flex bg-white border rounded-full shadow px-2 py-1 gap-2 z-20"
                  >
                    {REACTIONS.map(r => (
                      <button
                        key={r.type}
                        type="button"
                        onTouchStart={() => handleReactionTouchStart(post.id)}
                        onTouchEnd={handleReactionTouchEnd}
                        onPointerDown={e => {
                          e.preventDefault()
                          e.stopPropagation()
                          reactToPost(post.id, r.type)
                          setOpenReactionPostId(null)
                          unlockReactionPicker()
                        }}
                        className="hover:scale-125 active:scale-110 transition"
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

              {/* COMMENT (MOBILE SAFE) */}
              <button
                type="button"
                onPointerDown={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  setOpenCommentBox(prev => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 active:text-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
                Comment
              </button>

              {/* REMOVE */}
              {post.user.id === authUserId && (
                <button
                  onClick={() => hidePost(post.id)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              )}
            </div>

            {/* COMMENT COMPOSER */}
            {openCommentBox[post.id] && (
              <div className="flex gap-2 pt-2">
                <input
                  autoFocus
                  value={commentBodies[post.id] ?? ''}
                  onChange={e =>
                    setCommentBodies(prev => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment..."
                  className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
                <button
                  onClick={() => submitComment(post.id)}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Post
                </button>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
