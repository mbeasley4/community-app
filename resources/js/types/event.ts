export type Event = {
  id: number
  title: string
  description: string
  start_at: string
  end_at: string
  event_url?: string | null
  badge?: string | null
  status: 'draft' | 'published' | 'cancelled'
}