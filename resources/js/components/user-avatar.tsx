type Props = {
  name: string
  avatar: string | null
  size?: number
}

export default function UserAvatar({ name, avatar, size = 48 }: Props) {
  // Build initials from first + last name
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  // If avatar exists, show image
  if (avatar) {
    return (
      <img
        src={`/storage/${avatar}`}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    )
  }

  // Otherwise show initials circle
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700"
    >
      {initials}
    </div>
  )
}
