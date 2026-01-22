import { Bell } from 'lucide-react'

type NotificationBellProps = {
  count?: number
}

export default function NotificationBell({ count = 0 }: NotificationBellProps) {
  return (
    <button
      type="button"
      className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
      aria-label="Notifications"
    >
      {/* Bell Icon */}
      <Bell className="absolute left-0 -top-1 h-6 w-6" />

      {/* Badge */}
      {count > 0 && (
        <span className="absolute -top-2 -right-3 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
