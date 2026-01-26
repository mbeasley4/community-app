import { Link, router, usePage } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

type Event = {
  id: number
  title: string
  start_at: string
  end_at: string
  status: 'draft' | 'published' | 'cancelled'
}

type PaginationLink = {
  url: string | null
  label: string
  active: boolean
}

type PaginatedEvents = {
  data: Event[]
  links: PaginationLink[]
}

export default function EventsIndex({ events }: { events: PaginatedEvents }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  return (
    <CommunityLayoutNoRight>
      <div className="mx-auto max-w-5xl px-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Events
          </h1>

          <Link
            href="/admin/events/create"
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition"
          >
            New Event
          </Link>
        </div>

        {flash?.success && (
          <div className="rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
            {flash.success}
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {events.data.map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="font-medium text-gray-900">
                  {event.title}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(event.start_at).toLocaleString()} → {new Date(event.end_at).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-3">

                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  event.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : event.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {event.status}
                </span>

                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="rounded-md border border-orange-600 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => router.delete(`/admin/events/${event.id}`)}
                  className="rounded-md border border-red-600 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex flex-wrap gap-2">
            {events.links.map(link => (
                <Link
                key={link.label}
                href={link.url ?? '#'}
                className={`rounded border px-3 py-1 text-sm ${
                    link.active
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
            </div>


          {events.data.length === 0 && (
            <div className="text-sm text-gray-500">
              No events created yet.
            </div>
          )}
        </div>

      </div>
    </CommunityLayoutNoRight>
  )
}
