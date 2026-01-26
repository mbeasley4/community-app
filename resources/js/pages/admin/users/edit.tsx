import { useForm, Link, usePage } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function UserEdit({ user, roles }) {
  const { flash } = usePage().props as { flash?: { success?: string } }

  // Profile + role form
  const form = useForm({
    name: user.name,
    email: user.email,
    role: user.roles[0]?.name ?? 'cohort',
  })

  // Password form
  const passwordForm = useForm({
    password: '',
    password_confirmation: '',
  })

  return (
    <CommunityLayoutNoRight>
    <div className="px-6">

      <Link href="/admin/users" className="text-sm text-gray-500 hover:underline">
        ← Back to users
      </Link>

      <h1 className="text-2xl font-semibold mt-4 mb-6">
        Edit User
      </h1>
    {flash?.success && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
          {flash.success}
        </div>
      )}

      {/* Profile + role */}
      <form
        onSubmit={e => {
          e.preventDefault()
          form.put(`/admin/users/${user.id}`)
        }}
        className="space-y-4"
      >
        <div>
          <label className="text-sm">Name</label>
          <input
            value={form.data.name}
            onChange={e => form.setData('name', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
          {form.errors.name && (
            <p className="text-sm text-red-600 mt-1">
              {form.errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            value={form.data.email}
            onChange={e => form.setData('email', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
          {form.errors.email && (
            <p className="text-sm text-red-600 mt-1">
              {form.errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm">Role</label>
          <select
            value={form.data.role}
            onChange={e => form.setData('role', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          >
            {roles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {form.errors.role && (
            <p className="text-sm text-red-600 mt-1">
              {form.errors.role}
            </p>
          )}
        </div>

        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>

      {/* Password reset */}
      <div className="border-t mt-8 pt-6">
        <h2 className="font-medium mb-3">Reset Password</h2>

        <form
          onSubmit={e => {
            e.preventDefault()
            passwordForm.put(`/admin/users/${user.id}/password`)
          }}
          className="space-y-4"
        >
          <input
            type="password"
            placeholder="New password"
            onChange={e => passwordForm.setData('password', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
          {passwordForm.errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {passwordForm.errors.password}
            </p>
          )}

          <input
            type="password"
            placeholder="Confirm password"
            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
          {passwordForm.errors.password_confirmation && (
            <p className="text-sm text-red-600 mt-1">
              {passwordForm.errors.password_confirmation}
            </p>
          )}
          
          <button className="bg-gray-800 text-white px-4 py-2 rounded">
            Update Password
          </button>
        </form>
      </div>
    </div>
    {/* Purchase History */}
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Purchase History
        </h2>
        <span className="text-sm text-gray-500">
          {user.purchases.length} total
        </span>
      </div>

      {user.purchases.length === 0 && (
        <div className="rounded border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          No purchases found for this user.
        </div>
      )}

      {user.purchases.map(p => (
        <div
          key={p.id}
          className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">
                {p.purchased_at
                  ? new Date(p.purchased_at).toLocaleDateString()
                  : '—'}
              </div>
              <div className="text-xs text-gray-400">
                Session: {p.stripe_session_id}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold">
                ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
              </div>

              <span
                className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  p.status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : p.status === 'refunded'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {p.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mt-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Items Purchased
            </div>

            <div className="space-y-2">
              {p.items.map(i => (
                <div
                  key={i.id}
                  className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium capitalize">
                      {i.product_type}
                    </div>
                    <div className="text-xs text-gray-500">
                      Price ID: {i.stripe_price_id}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm">
                      ${(i.unit_amount / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty: {i.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Actions */}
          {p.status === 'paid' && (
            <div className="mt-4 flex gap-3">
              {/* Local Mark Refunded */}
              <form
                method="post"
                action={`/admin/purchases/${p.id}/mark-refunded`}
              >
                <button
                  type="submit"
                  className="rounded border border-orange-300 px-3 py-1 text-xs font-medium text-orange-700 hover:bg-orange-50"
                >
                  Mark Refunded
                </button>
              </form>

              {/* Stripe Refund */}
              <form
                method="post"
                action={`/admin/purchases/${p.id}/refund-stripe`}
              >
                <button
                  type="submit"
                  className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                >
                  Refund via Stripe
                </button>
              </form>
            </div>
          )}

          {p.status === 'refunded' && (
            <div className="mt-3 text-xs font-medium text-red-600">
              This purchase has been refunded.
            </div>
          )}
        </div>
      ))}
    </div>



    </CommunityLayoutNoRight>
  )
}
