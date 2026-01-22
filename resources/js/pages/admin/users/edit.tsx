import { useForm, Link } from '@inertiajs/react'
import CommunityLayoutNoRight from '@/layouts/community-layout-no-right'

export default function UserEdit({ user, roles }) {

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
    <div className="max-w-xl mx-auto p-6">

      <Link href="/admin/users" className="text-sm text-gray-500 hover:underline">
        ← Back to users
      </Link>

      <h1 className="text-2xl font-semibold mt-4 mb-6">
        Edit User
      </h1>

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
        </div>

        <div>
          <label className="text-sm">Email</label>
          <input
            value={form.data.email}
            onChange={e => form.setData('email', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />
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

          <input
            type="password"
            placeholder="Confirm password"
            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
            className="border w-full px-3 py-2 rounded"
          />

          <button className="bg-gray-800 text-white px-4 py-2 rounded">
            Update Password
          </button>
        </form>
      </div>
    </div>
    </CommunityLayoutNoRight>
  )
}
