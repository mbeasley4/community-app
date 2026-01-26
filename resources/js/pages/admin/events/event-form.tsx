import { useForm, Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'
import { EventStatus } from '@/types/event-status'

type EventFormProps = {
  event?: {
    id: number
    title: string
    description: string | null
    start_at: string
    end_at: string | null
    event_url?: string | null
    badge?: string | null
    status: EventStatus
  }
}

export default function EventForm({ event }: EventFormProps) {

  const form = useForm({
    title: event?.title ?? '',
    description: event?.description ?? '',
    start_at: event?.start_at ? event.start_at.slice(0,16) : '',
    end_at: event?.end_at ? event.end_at.slice(0,16) : '',
    event_url: event?.event_url ?? '',
    badge: event?.badge ?? '',
    status: event?.status ?? 'draft'
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (event) {
      form.put(`/admin/events/${event.id}`)
    } else {
      form.post('/admin/events')
    }
  }

  return (
    <CommunityLayoutNoRight>
      <div className="px-6 space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {event ? 'Edit Event' : 'Create Event'}
          </h1>

          <Link
            href="/admin/events"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to events
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">

          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Event title"
            value={form.data.title}
            onChange={e => form.setData('title', e.target.value)}
          />
          {form.errors.title && (
            <p className="text-xs text-red-600">{form.errors.title}</p>
          )}

          <textarea
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Description"
            rows={4}
            value={form.data.description}
            onChange={e => form.setData('description', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="datetime-local"
                className="w-full rounded border px-3 py-2 text-sm"
                value={form.data.start_at}
                onChange={e => form.setData('start_at', e.target.value)}
              />
              {form.errors.start_at && (
                <p className="text-xs text-red-600">{form.errors.start_at}</p>
              )}
            </div>

            <div>
              <input
                type="datetime-local"
                className="w-full rounded border px-3 py-2 text-sm"
                value={form.data.end_at}
                onChange={e => form.setData('end_at', e.target.value)}
              />
            </div>
          </div>

          <input
            className="w-full rounded border px-3 py-2 text-sm"
            placeholder="Event URL (optional)"
            value={form.data.event_url}
            onChange={e => form.setData('event_url', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Badge (Live, Q&A, New)"
              value={form.data.badge}
              onChange={e => form.setData('badge', e.target.value)}
            />

            <select
              className="w-full rounded border px-3 py-2 text-sm"
              value={form.data.status}
              onChange={e => form.setData('status', e.target.value as EventStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              disabled={form.processing}
              className="rounded bg-orange-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {form.processing ? 'Saving…' : 'Save Event'}
            </button>
          </div>

        </form>
      </div>
    </CommunityLayoutNoRight>
  )
}
