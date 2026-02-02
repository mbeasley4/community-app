import { useEffect, useRef, useState } from 'react'
import { usePage } from '@inertiajs/react'
import { MessageCircle, Trash2 } from 'lucide-react'
import ReactionSummary from './reaction-summary'
import { REACTIONS } from '@/config/reactions'
import { Post } from '@/types'

/**
 * Type definition for authenticated user data
 */
type AuthUser = {
  id: number
  name: string
}

/**
 * Type definition for Inertia.js page props
 */
type PageProps = {
  auth: {
    user: AuthUser | null
  }
}

/**
 * PostFeed Component
 *
 * A social media-style feed that displays posts with reactions and comments.
 * Features include:
 * - Creating new posts with images
 * - Reacting to posts with various emoji reactions (desktop hover & mobile long-press)
 * - Adding comments to posts
 * - Removing own posts
 *
 * @param onVisibleCountChange - Optional callback that receives the count of posts by the current user
 */
export default function PostFeed({
  onVisibleCountChange,
}: {
  onVisibleCountChange?: (n: number) => void
}) {
  /* ---------------- POST & FORM STATE ---------------- */
  const [posts, setPosts] = useState<Post[]>([])  // All posts in the feed
  const [body, setBody] = useState('')  // New post body text
  const [loading, setLoading] = useState(true)  // Initial posts loading state
  const [submitting, setSubmitting] = useState(false)  // Post submission in progress
  const [error, setError] = useState<string | null>(null)  // Post creation error message

  /* ---------------- IMAGE & COMMENT STATE ---------------- */
  const [images, setImages] = useState<File[]>([])  // Selected images for new post
  const [commentBodies, setCommentBodies] = useState<Record<number, string>>({})  // Comment text by post ID
  const [openCommentBox, setOpenCommentBox] = useState<Record<number, boolean>>({})  // Comment box visibility by post ID

  /* ---------------- REACTION STATE ---------------- */
  // Tracks which post's reaction picker is currently open
  const [openReactionPostId, setOpenReactionPostId] = useState<number | null>(null)
  // Prevents reaction picker from closing on mobile after long-press
  const [reactionPickerLocked, setReactionPickerLocked] = useState(false)

  // Timer for detecting long-press on mobile devices
  const longPressTimer = useRef<number | null>(null)
  // Flag to distinguish between tap and long-press
  const didLongPress = useRef(false)

  // Get authenticated user from Inertia page props
  const { auth } = usePage<PageProps>().props
  const authUserId = auth.user?.id ?? 0

  // Extract CSRF token from meta tag for API requests
  const csrfToken =
    document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''

  /* ---------------- LOAD POSTS ---------------- */

  /**
   * Fetches all posts from the API and updates the feed.
   * Also calculates and reports how many posts belong to the current user.
   */
  const refreshPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        headers: { Accept: 'application/json' },
      })
      const data = await res.json()
      const list: Post[] = Array.isArray(data.data) ? data.data : []

      setPosts(list)

      // Count posts created by the current user and notify parent
      const myCount = list.filter(p => p.user.id === authUserId).length
      onVisibleCountChange?.(myCount)
    } catch {
      // On error, clear posts and reset count
      setPosts([])
      onVisibleCountChange?.(0)
    } finally {
      setLoading(false)
    }
  }

  // Load posts on component mount
  useEffect(() => {
    refreshPosts()
  }, [])

  /* ---------------- CREATE POST ---------------- */

  /**
   * Handles post creation form submission.
   * Uploads post body text and any selected images to the API.
   * On success, adds the new post to the top of the feed.
   */
  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    // Don't submit if body is empty or only whitespace
    if (!body.trim()) return

    setSubmitting(true)
    setError(null)

    // Build form data with text body and image files
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

      // Add new post to the beginning of the feed
      setPosts(prev => [data, ...prev])
      // Clear form inputs
      setBody('')
      setImages([])
    } catch {
      setError('Could not create post')
    } finally {
      setSubmitting(false)
    }
  }

  /* ---------------- DELETE POST ---------------- */

  /**
   * Removes a post from the feed.
   * Sends a DELETE request to the API and removes the post from local state on success.
   *
   * @param postId - The ID of the post to remove
   */
  const hidePost = async (postId: number) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
      })

      if (res.ok) {
        // Remove post from local state
        setPosts(prev => prev.filter(p => p.id !== postId))

        // Update visible count for the parent component
        const myCount = posts.filter(p => p.user.id === authUserId && p.id !== postId).length
        onVisibleCountChange?.(myCount)
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }

  /* ---------------- SUBMIT COMMENT ---------------- */

  /**
   * Submits a comment on a post.
   * Sends the comment to the API and refreshes the feed on success.
   *
   * @param postId - The ID of the post to comment on
   */
  const submitComment = async (postId: number) => {
    const body = commentBodies[postId]?.trim()
    if (!body) return

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          Accept: 'application/json',
        },
        body: JSON.stringify({ body }),
      })

      if (res.ok) {
        // Refresh posts to show the new comment
        await refreshPosts()

        // Clear comment input and close comment box
        setCommentBodies(prev => ({ ...prev, [postId]: '' }))
        setOpenCommentBox(prev => ({ ...prev, [postId]: false }))
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    }
  }

  /* ---------------- REACT TO POST ---------------- */

  /**
   * Sends a reaction to a post (like, love, etc.).
   * Updates the post's reaction summary in the local state on success.
   *
   * @param postId - The ID of the post to react to
   * @param type - The reaction type (e.g., 'like', 'love', 'celebrate')
   */
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

    // Update the specific post's reaction summary
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, reaction_summary: data.reactionSummary }
          : p
      )
    )
  }

  /* ---------------- LONG PRESS HANDLERS (Mobile Touch Support) ---------------- */

  /**
   * Initiates long-press detection when user touches a reaction button on mobile.
   * If held for 500ms, shows the reaction picker and locks it open.
   *
   * @param postId - The ID of the post being reacted to
   */
  const handleReactionTouchStart = (postId: number) => {
    didLongPress.current = false

    longPressTimer.current = window.setTimeout(() => {
      didLongPress.current = true
      setReactionPickerLocked(true)  // Prevent picker from closing immediately
      setOpenReactionPostId(postId)
    }, 500)  // 500ms threshold for long-press
  }

  /**
   * Cancels long-press detection when user releases touch.
   * If released before 500ms, it's treated as a tap, not a long-press.
   */
  const handleReactionTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  /**
   * Unlocks the reaction picker after a brief delay.
   * This allows the user to select a reaction on mobile before auto-close is re-enabled.
   */
  const unlockReactionPicker = () => {
    setTimeout(() => {
      setReactionPickerLocked(false)
    }, 250)  // Short delay to prevent immediate close
  }

  /* ---------------- CLOSE PICKER ON OUTSIDE TOUCH ---------------- */

  /**
   * Effect: Closes the reaction picker when user touches outside of it (mobile).
   * Respects the lock state to prevent closing during long-press selection.
   */
  useEffect(() => {
    const close = (e: TouchEvent) => {
      // Don't close if picker is locked (during long-press interaction)
      if (reactionPickerLocked) return

      const target = e.target as HTMLElement
      // Don't close if touch is inside the reaction picker
      if (target.closest('[data-reaction-picker]')) return

      // Close the reaction picker
      setOpenReactionPostId(null)
    }

    document.addEventListener('touchstart', close)
    return () => document.removeEventListener('touchstart', close)
  }, [reactionPickerLocked])

  /* ---------------- HELPERS ---------------- */

  /**
   * Generates user initials from full name for avatar display.
   * Takes up to the first two words and uses their first letters.
   *
   * @param name - Full name of the user
   * @returns Uppercase initials (e.g., "John Doe" → "JD")
   */
  const initials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase()

  /* ---------------- RENDER ---------------- */

  // Show loading skeleton while initial posts are being fetched
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

      {/* CREATE POST FORM - Allows users to compose and submit new posts with optional images */}
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
