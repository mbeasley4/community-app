import { useForm } from '@inertiajs/react'

export default function AdForm({ ad }) {

  const form = useForm({
    title: ad?.title ?? '',
    link_url: ad?.link_url ?? '',
    position: ad?.position ?? 0,
    is_active: ad?.is_active ?? true,
    image: null,
  })

  function submit(e) {
    e.preventDefault()

    if (ad) {
      form.post(`/admin/ads/${ad.id}?_method=PUT`)
    } else {
      form.post('/admin/ads')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">

      <input
        placeholder="Title"
        value={form.data.title}
        onChange={e => form.setData('title', e.target.value)}
        className="border w-full px-3 py-2 rounded"
      />

      <input
        placeholder="Link URL"
        value={form.data.link_url}
        onChange={e => form.setData('link_url', e.target.value)}
        className="border w-full px-3 py-2 rounded"
      />

      <input
        type="number"
        placeholder="Position order"
        value={form.data.position}
        onChange={e => form.setData('position', Number(e.target.value))}
        className="border w-full px-3 py-2 rounded"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.data.is_active}
          onChange={e => form.setData('is_active', e.target.checked)}
        />
        Active
      </label>

      <input
        type="file"
        onChange={e => form.setData('image', e.target.files[0])}
      />

      <button className="bg-orange-500 text-white px-4 py-2 rounded">
        Save Advertisement
      </button>
    </form>
  )
}
