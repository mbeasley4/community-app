import { useMemo } from 'react'

type fit30DayCounterProps = {
  startDate: string // format: YYYY-MM-DD
  reintroDays?: number
  totalDays?: number
}

export default function Fit30DayCounter({
  startDate,
  totalDays = 30,
  reintroDays = 15,
}: fit30DayCounterProps) {
  const result = useMemo(() => {
    const start = new Date(startDate + 'T00:00:00')
    const today = new Date()

    // Normalize today to midnight
    today.setHours(0, 0, 0, 0)

    const diffMs = today.getTime() - start.getTime()
    const dayNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1

    if (dayNumber < 1) {
      return {
        status: 'not-started',
        label: 'Not Started',
      }
    }

    if (dayNumber > totalDays) {
      return {
        status: 'reintro',
        label: 'Reintro 🎉',
      }
    }

    if (dayNumber > (totalDays + reintroDays)) {
      return {
        status: 'completed',
        label: 'Completed 🎉',
      }
    }

    return {
      status: 'active',
      label: `Day ${dayNumber} of ${totalDays}`,
    }
  }, [startDate, totalDays])

  return (
    <div className="rounded-xl border bg-white p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          Group Fit30 Day
        </p>

        <p className="text-xl font-semibold text-gray-900">
          {result.label}
        </p>
      </div>

      {/* Status Indicator */}
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          result.status === 'active'
            ? 'bg-green-100 text-green-800'
            : result.status === 'reintro'
            ? 'bg-blue-100 text-blue-800'
            : result.status === 'completed'
            ? 'bg-indigo-100 text-indigo-800'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {result.status === 'active'
          ? 'In Progress'
          : result.status === 'completed'
          ? 'Done'
          : 'Upcoming'}
      </span>
    </div>
  )
}
