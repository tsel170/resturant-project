import React, { useState } from "react"
import RecipeModal from "./RecipeModal"
import axios from "axios"

const MealCard = ({ meal, onEditClick, onDeleteClick }) => {
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(meal.available)

  const handleToggleAvailability = async () => {
    setIsLoading(true)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/meals/toggleAvailability/${meal._id}`
      )
      if (response.data.success) {
        setIsAvailable(!isAvailable)
      }
    } catch (error) {
      console.error("Error toggling meal availability:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-lg transition-all hover:shadow-xl">
      {/* Availability Badge - Fixed positioning and z-index */}
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleToggleAvailability}
          disabled={isLoading}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            isAvailable
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          } ${isLoading ? "cursor-not-allowed opacity-50" : ""} shadow-sm hover:shadow-md`}
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <span
              className={`h-3 w-3 rounded-full ${
                isAvailable ? "bg-green-500" : "bg-red-500"
              }`}
            />
          )}
          <span className="font-semibold">
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </button>
      </div>

      {/* Left side - Image */}
      <div className="h-32 w-32 flex-shrink-0">
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.title}
            className={`h-full w-full rounded-lg object-cover ${
              !isAvailable ? "opacity-50" : ""
            }`}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center rounded-lg bg-gray-100 ${
              !isAvailable ? "opacity-50" : ""
            }`}
          >
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Right side - Content */}
      <div className="ml-4 flex flex-1 flex-col">
        <div className="mb-2 pr-24">
          <h3
            className={`text-xl font-semibold text-gray-900 ${
              !isAvailable ? "opacity-50" : ""
            }`}
          >
            {meal.title}
          </h3>
          <p
            className={`text-sm text-gray-600 ${
              !isAvailable ? "opacity-50" : ""
            }`}
          >
            Category:{" "}
            {meal.category.charAt(0).toUpperCase() + meal.category.slice(1)}
          </p>
          <p
            className={`mt-1 text-lg font-medium text-indigo-600 ${
              !isAvailable ? "opacity-50" : ""
            }`}
          >
            ₪{meal.price}
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => setIsRecipeModalOpen(true)}
            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
            title="View Recipe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </button>
          <button
            onClick={() => onEditClick(meal)}
            className="rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
            title="Edit Meal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDeleteClick(meal._id)}
            className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
            title="Delete Meal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <RecipeModal
        meal={meal}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
      />
    </div>
  )
}

export default MealCard
