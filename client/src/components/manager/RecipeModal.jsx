const RecipeModal = ({ meal, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header with gradient background */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
          <h2 className="pr-8 text-2xl font-bold text-white">
            {meal.title} Recipe
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[calc(80vh-8rem)] overflow-y-auto bg-gradient-to-b from-purple-50 to-white p-6">
          {/* Ingredients section */}
          <div className="mb-6">
            <h3 className="mb-3 flex items-center text-xl font-semibold text-indigo-800">
              <svg
                className="mr-2 h-5 w-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Ingredients
            </h3>
            <ul className="space-y-2">
              {meal.Ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-700 transition-colors hover:text-indigo-600"
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></span>
                  {ingredient.ingredient} - {ingredient.quantity}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions section */}
          <div>
            <h3 className="mb-3 flex items-center text-xl font-semibold text-indigo-800">
              <svg
                className="mr-2 h-5 w-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Instructions
            </h3>
            <div className="whitespace-pre-line rounded-lg border border-purple-100 bg-white/80 p-6 text-gray-700 shadow-inner">
              {meal.recipe}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeModal
