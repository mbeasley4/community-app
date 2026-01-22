import React, { useEffect, useState } from 'react'
import { EventInput } from '@fullcalendar/core'

/* =========================
   Utilities (SAFE)
========================= */

// Handles both:
// - "2026-01-07 09:00:00" (Laravel/MySQL style)
// - "2026-01-07T09:00:00Z" (ISO)
const parseDate = (value: unknown): Date | null => {
  if (!value || typeof value !== 'string') return null

  // Convert "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')

  const d = new Date(normalized)
  return isNaN(d.getTime()) ? null : d
}

const formatDateForICS = (date: Date | null): string | null => {
  if (!date || isNaN(date.getTime())) return null
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/* =========================
   Calendar Icon
========================= */

const CalendarIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

/* =========================
   Calendar Helpers (SAFE)
========================= */

const googleCalendarUrl = (event: EventInput): string | null => {
  const start = parseDate(event.start)
  if (!start) return null

  const end =
    event.end && parseDate(event.end)
      ? parseDate(event.end)!
      : new Date(start.getTime() + 60 * 60 * 1000)

  const startICS = formatDateForICS(start)
  const endICS = formatDateForICS(end)
  if (!startICS || !endICS) return null

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    (event.title as string) ?? ''
  )}&dates=${startICS}/${endICS}&details=${encodeURIComponent(
    event.extendedProps?.description ?? ''
  )}`
}

const generateICS = (event: EventInput): string | null => {
  const start = parseDate(event.start)
  if (!start) return null

  const end =
    event.end && parseDate(event.end)
      ? parseDate(event.end)!
      : new Date(start.getTime() + 60 * 60 * 1000)

  const startICS = formatDateForICS(start)
  const endICS = formatDateForICS(end)
  if (!startICS || !endICS) return null

  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Event Listing//EN
BEGIN:VEVENT
UID:${event.id}@events.local
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${startICS}
DTEND:${endICS}
SUMMARY:${event.title}
DESCRIPTION:${event.extendedProps?.description ?? ''}
END:VEVENT
END:VCALENDAR
`.trim()
}

const downloadICS = (event: EventInput) => {
  const ics = generateICS(event)
  if (!ics) return

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title}.ics`
  link.click()

  URL.revokeObjectURL(url)
}

/* =========================
   Component
========================= */

const EventListing: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventInput[]>([])
  const [pastEvents, setPastEvents] = useState<EventInput[]>([])
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/events')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events')
        return res.json()
      })
      .then(data => {
        // Normalize API payload -> FullCalendar-like EventInput
        const normalize = (events: any[]): EventInput[] =>
          (events ?? []).map(e => ({
            id: e.id,
            title: e.title,
            start: e.start_at, // <-- from your JSON
            end: e.end_at,     // <-- from your JSON
            allDay: e.allDay ?? false,
            extendedProps: {
              description: e.description ?? '',
            },
          }))

        setUpcomingEvents(normalize(data.upcoming))
        setPastEvents(normalize(data.past))
      })
      .catch(() => setError('Unable to load events'))
      .finally(() => setLoading(false))
  }, [])

  const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents

  return (
    <section className="px-6">
      <header className="mb-6">
        <h2 className="text-3xl font-semibold tracking-tight text-black">
          Events
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Stay up to date with what’s happening
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'upcoming'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Upcoming / Current ({upcomingEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'past'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-xl bg-gray-200" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-gray-500">
          No {activeTab === 'upcoming' ? 'upcoming' : 'past'} events.
        </div>
      )}

      {/* Event List */}
      {!loading && !error && events.length > 0 && (
        <ul className="space-y-4">
          {events.map(event => {
            const start = parseDate(event.start)
            const end = event.end ? parseDate(event.end) : null

            if (!start) return null // skip invalid records safely

            const calendarUrl = googleCalendarUrl(event)

            return (
              <li
                key={String(event.id)}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-medium text-black">{event.title}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {start.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {' · '}
                  {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {end && (
                    <>
                      {' – '}
                      {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </>
                  )}
                </p>

                {event.extendedProps?.description && (
                  <p className="mt-4 text-sm text-gray-700">
                    {event.extendedProps.description}
                  </p>
                )}

                {/* Add to Calendar (upcoming only) */}
                {activeTab === 'upcoming' && calendarUrl && (
                  <div className="mt-5 flex gap-3">
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Add to Google Calendar
                    </a>

                    <button
                      onClick={() => downloadICS(event)}
                      className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Download .ics
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default EventListing