import { router } from '@inertiajs/react'

type Notification = {
  id: number
  title: string
  body: string | null
  url: string | null
  created_at: string
  read_at: string | null
}

type Props = {
  notifications: Notification[]
}

export default function Notifications({ notifications }: Props) {
  return (
    <div className="max-w-3xl mx-auto space-y-2 p-6">
      {notifications.map(n => (
        <div
          key={n.id}
          onClick={() => {
            router.post('/notifications/read', { id: n.id })
            if (n.url) window.location.href = n.url
          }}
          className={`p-4 border rounded cursor-pointer transition ${
            n.read_at ? 'bg-white' : 'bg-gray-50 font-medium'
          }`}
        >
          <div>{n.title}</div>
          {n.body && <div className="text-sm text-gray-600">{n.body}</div>}
          <div className="text-xs text-gray-400">
            {new Date(n.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}
