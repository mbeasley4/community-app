export default function ConfirmLogin() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-semibold">
        Welcome back
      </h1>

      <p>Please log in to continue your purchase.</p>

      <a href="/login" className="block text-center bg-orange-600 text-white py-2 rounded">
        Log in
      </a>
    </div>
  )
}
