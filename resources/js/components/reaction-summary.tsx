import { REACTIONS } from '@/config/reactions'

type Props = {
  reactionSummary?: Record<string, number>
  onReact: (type: string) => void
}

export default function ReactionSummary({
  reactionSummary = {},
  onReact
}: Props) {

  const counts = reactionSummary
  const hasReactions = Object.values(counts).some(c => c > 0)

  // If no reactions exist yet, render nothing
  if (!hasReactions) return null

  return (
    <div className="flex gap-3 mt-2">
      {REACTIONS.map(({ type, Icon, bg }) => {
        const count = counts[type] ?? 0
        if (count === 0) return null

        return (
          <button
            key={type}
            type="button"
            onClick={() => onReact(type)}
            className="flex items-center gap-1 text-xs"
          >
            {/* Icon circle */}
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${bg}`}
            >
              <Icon className="h-3.5 w-3.5 text-white" />
            </span>

            {/* Counter */}
            <span className="text-gray-600">{count}</span>
          </button>
        )
      })}
    </div>
  )
}
