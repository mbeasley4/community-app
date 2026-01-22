import { useEffect, useState } from 'react'
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

export default function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [commentBodies, setCommentBodies] = useState<Record<number, string>>({})
  const [openCommentBox, setOpenCommentBox] = useState<Record<number, boolean>>({})

  const { auth } = usePage<PageProps>().props
  const authUserId = auth.user?.id ?? 0

  const csrfToken =
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''

  /* ---------------- LOAD POSTS ---------------- */

  const refreshPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        headers: { Accept: 'application/json' }
      })
      const data = await res.json()
      setPosts(Array.isArray(data.data) ? data.data : [])
    } catch {
      setPosts([])
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

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json'
        },
        body: JSON.stringify({ body })
      })

      const data = await res.json()
      if (!res.ok) throw new Error()

      setPosts(prev => [data, ...prev])
      setBody('')
    } catch {
      setError('Could not create post')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- HIDE POST ---------------- */

  const hidePost = async (id: number) => {
    await fetch(`/api/posts/${id}/hide`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json'
      }
    })

    setPosts(prev => prev.filter(p => p.id !== id))
  }

  /* ---------------- REACT ---------------- */

  const reactToPost = async (postId: number, type: string) => {
    const res = await fetch(`/api/posts/${postId}/react`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json'
      },
      body: JSON.stringify({ type })
    })

    const data = await res.json()
    if (!res.ok) return

    // Update only this post’s summary instantly
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, reaction_summary: data.reactionSummary }
          : p
      )
    )
  }

  /* ---------------- COMMENTS ---------------- */

  const toggleCommentBox = (postId: number) => {
    setOpenCommentBox(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const submitComment = async (postId: number) => {
    const text = commentBodies[postId]
    if (!text?.trim()) return

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json'
      },
      body: JSON.stringify({ body: text })
    })

    const data = await res.json()
    if (!res.ok) return

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: [data, ...(p.comments ?? [])],
              comments_count: (p.comments_count ?? 0) + 1
            }
          : p
      )
    )

    setCommentBodies(prev => ({ ...prev, [postId]: '' }))
    setOpenCommentBox(prev => ({ ...prev, [postId]: false }))
  }

  const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()


  const hideComment = async (commentId: number, postId: number) => {
    await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        Accept: 'application/json'
      }
    })

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments?.filter(c => c.id !== commentId),
              comments_count: (p.comments_count ?? 1) - 1
            }
          : p
      )
    )
  }

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
    <section className="mx-auto px-6 space-y-6">

      {/* CREATE POST */}
      <form onSubmit={submitPost} className="rounded-xl border bg-white p-4 shadow-sm space-y-3">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full resize-none rounded-md border border-gray-300 p-2 text-gray-800"
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
        const commentCount = post.comments_count ?? post.comments?.length ?? 0
        const DefaultReactionIcon = REACTIONS[0].Icon

        return (
          <article key={post.id} className="rounded-xl border bg-white p-5 shadow-sm space-y-3">

            {/* Header */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {/* Avatar */}
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

              {/* Name + date */}
              <div>
                <div className="font-semibold text-gray-800">
                  {post.user.name}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>

            </div>


            {/* Body */}
            <p className="whitespace-pre-line text-gray-800">{post.body}</p>

            {/* SUMMARY BAR */}
            <div className="flex items-center justify-between text-xs text-gray-500 border-b pb-1">
              <ReactionSummary
                reactionSummary={post.reaction_summary}
                onReact={(type) => reactToPost(post.id, type)}
              />

              {commentCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {commentCount} comment{commentCount !== 1 && 's'}
                </div>
              )}
            </div>

            {/* ACTION BAR */}
            <div className="flex items-center justify-between pt-2">

              <div className="flex items-center gap-6">

                {/* LIKE POPUP */}
                <div className="relative group inline-block">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                      <DefaultReactionIcon className="h-4 w-4 text-gray-600" />
                    </span>
                    Like
                  </button>

                  {/* Hover bridge */}
                  <div className="absolute left-0 top-full h-2 w-full" />

                  {/* Popup */}
                  <div className="absolute left-0 top-full mt-2 hidden group-hover:flex bg-white border rounded-full shadow px-2 py-1 gap-2 z-10">
                    {REACTIONS.map(r => (
                      <button
                        key={r.type}
                        onClick={() => reactToPost(post.id, r.type)}
                        type="button"
                        className="hover:scale-125 transition"
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${r.bg}`}>
                          <r.Icon className="h-4 w-4 text-white" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* COMMENT BUTTON */}
                <button
                  onClick={() => toggleCommentBox(post.id)}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </button>
              </div>

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

            {/* COMMENTS */}
            {post.comments?.map(comment => (
              <div key={comment.id} className="text-sm text-gray-700 border-l-2 pl-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {comment.user.avatar_url ? (
                    <img
                      src={comment.user.avatar_url}
                      className="h-7 w-7 rounded-full object-cover"
                      alt={comment.user.name}
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                      {initials(comment.user.name)}
                    </div>
                  )}

                  <div>
                    <div className="font-semibold text-gray-800">
                      {comment.user.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>

                </div>
                <p className="py-3 whitespace-pre-line">{comment.body}</p>
                {/* REMOVE */}
                {comment.user.id === authUserId && (
                <button
                    onClick={() => hideComment(comment.id, post.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* COMMENT COMPOSER */}
            {openCommentBox[post.id] && (
              <div className="flex gap-2 pt-2">
                <input
                  value={commentBodies[post.id] ?? ''}
                  onChange={e =>
                    setCommentBodies(prev => ({ ...prev, [post.id]: e.target.value }))
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
