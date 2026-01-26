import { useState } from 'react'
import SubmitRecipeModal from './submit-recipe-modal'

export default function SubmitRecipeButton({
  onSubmitted
}: {
  onSubmitted: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top button */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white"
        >
          Share a Recipe
        </button>
      </div>

      {/* Modal only appears when open = true */}
      {open && (
        <SubmitRecipeModal
          onClose={() => setOpen(false)}
          onSubmitted={() => {
            setOpen(false)
            onSubmitted()
          }}
        />
      )}
    </>
  )
}
