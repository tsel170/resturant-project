import React, { useContext, useEffect, useState } from "react"
import DefaultPage from "../../components/general/DefaultPage"
import axios from "axios"
import { toast } from "react-hot-toast"
import MealCard from "../../components/manager/MealCard"
import { AuthContext } from "../../context/AuthContext"

const MEALDB_API = "https://www.themealdb.com/api/json/v1/1/search.php?s="

const MenuManagement = () => {
  const { meals, setMeals, isLoadingMeals, fetchMeals } =
    useContext(AuthContext)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMeal, setNewMeal] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    Ingredients: [{ ingredient: "", quantity: "" }],
    theDishPreparer: "chef",
    image: "",
  })
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [deleteModalMeal, setDeleteModalMeal] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [filterCategory, setFilterCategory] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [searchTitle, setSearchTitle] = useState("")
  const [showRecipeModal, setShowRecipeModal] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showRecipeEditModal, setShowRecipeEditModal] = useState(false)
  const [showRecipeAddModal, setShowRecipeAddModal] = useState(false)
  const [tempRecipe, setTempRecipe] = useState("")
  const [showAddExistingForm, setShowAddExistingForm] = useState(false)
  const [existingMeals, setExistingMeals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showMealDetailsModal, setShowMealDetailsModal] = useState(false)
  const [selectedMealDetails, setSelectedMealDetails] = useState(null)
  const [showDescriptionModal, setShowDescriptionModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [tempDescription, setTempDescription] = useState("")
  const [tempPrice, setTempPrice] = useState("")
  const [isAddingMeal, setIsAddingMeal] = useState(false)
  const [addMealError, setAddMealError] = useState(null)

  const uniqueCategories = [...new Set(meals.map((meal) => meal.category))]

  // All possible categories from the schema

  // Combine default and existing categories, remove duplicates
  const allCategories = [...new Set([...uniqueCategories])]

  // Add this new state for all meals from TheMealDB
  const [allMealDBMeals, setAllMealDBMeals] = useState([])

  // Add this useEffect to fetch all meals when the component mounts
  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const response = await axios.get(`${MEALDB_API}`)
        setAllMealDBMeals(response.data.meals || [])
        setSearchResults(response.data.meals || []) // Show all meals initially
      } catch (err) {
        console.error("Error fetching meals:", err)
      }
    }
    fetchAllMeals()
  }, [])

  useEffect(() => {
    if (showAddExistingForm) {
      searchMeals("")
    }
  }, [showAddExistingForm])

  const handleAddIngredient = () => {
    setNewMeal({
      ...newMeal,
      Ingredients: [...newMeal.Ingredients, { ingredient: "", quantity: "" }],
    })
  }

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = newMeal.Ingredients.filter((_, i) => i !== index)
    setNewMeal({ ...newMeal, Ingredients: updatedIngredients })
  }

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = newMeal.Ingredients.map((ing, i) => {
      if (i === index) {
        return { ...ing, [field]: value }
      }
      return ing
    })
    setNewMeal({ ...newMeal, Ingredients: updatedIngredients })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Add validation for all required fields
    if (!newMeal.title.trim()) {
      setError("Please enter a title")
      setIsLoading(false)
      return
    }

    if (!newMeal.price || newMeal.price <= 0) {
      setError("Please enter a valid price greater than 0")
      setIsLoading(false)
      return
    }

    if (!newMeal.category) {
      setError("Please select or enter a category")
      setIsLoading(false)
      return
    }

    if (!newMeal.description.trim()) {
      setError("Please enter a description")
      setIsLoading(false)
      return
    }

    // Check if there's at least one ingredient with both fields filled
    const hasValidIngredients = newMeal.Ingredients.some(
      (ing) => ing.ingredient.trim() && ing.quantity.trim()
    )
    if (!hasValidIngredients) {
      setError("Please add at least one ingredient with both name and quantity")
      setIsLoading(false)
      return
    }

    try {
      const mealData = {
        ...newMeal,
        image: newMeal.image || "https://via.placeholder.com/400",
      }
      await axios.post(
        import.meta.env.VITE_SERVER + "/api/meals/addMeal",
        mealData
      )
      const response = await axios.get(
        import.meta.env.VITE_SERVER + "/api/meals/getAllMeals"
      )
      setMeals(response.data.Meals)
      setNewMeal({
        title: "",
        description: "",
        price: "",
        category: "",
        Ingredients: [{ ingredient: "", quantity: "" }],
        theDishPreparer: "chef",
        image: "",
      })
      setIsNewCategory(false)
      setNewCategory("")
      setShowAddForm(false)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while adding the meal. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    if (value === "new") {
      setIsNewCategory(true)
      setNewCategory("")
    } else {
      setIsNewCategory(false)
      setNewMeal({ ...newMeal, category: value })
    }
  }

  const handleNewCategorySubmit = (value) => {
    if (value.trim()) {
      setNewCategory(value)
      setNewMeal({ ...newMeal, category: value.trim().toLowerCase() })
    }
  }

  const MealSkeleton = () => (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <div className="animate-pulse">
        <div className="h-6 w-3/4 rounded bg-gray-200"></div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200"></div>
        </div>
        <div className="mt-4 h-8 w-1/4 rounded bg-gray-200"></div>
        <div className="mt-3 h-6 w-1/3 rounded bg-gray-200"></div>
        <div className="mt-4 h-10 w-full rounded bg-gray-200"></div>
      </div>
    </div>
  )

  const handleDeleteMeal = async () => {
    if (!deleteModalMeal) return

    setIsLoading(true)
    try {
      await axios.delete(
        import.meta.env.VITE_SERVER + `/api/meals/deleteMeal/${deleteModalMeal}`
      )
      setMeals(meals.filter((meal) => meal._id !== deleteModalMeal))
      setDeleteModalMeal(null)
    } catch (error) {
      console.error("Error deleting meal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setNewMeal({
      title: "",
      description: "",
      price: "",
      category: "",
      Ingredients: [{ ingredient: "", quantity: "" }],
      theDishPreparer: "chef",
      image: "",
    })
    setIsNewCategory(false)
    setNewCategory("")
  }

  const handleEditClick = (meal) => {
    setEditingMeal({
      ...meal,
      price: String(meal.price), // Convert price to string for input field
    })
    setShowEditForm(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await axios.put(
        import.meta.env.VITE_SERVER +
          `/api/meals/updateMeal/${editingMeal._id}`,
        editingMeal
      )
      const response = await axios.get(
        import.meta.env.VITE_SERVER + "/api/meals/getAllMeals"
      )
      setMeals(response.data.Meals)
      setShowEditForm(false)
      setEditingMeal(null)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while updating the meal."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditIngredientChange = (index, field, value) => {
    const updatedIngredients = editingMeal.Ingredients.map((ing, i) => {
      if (i === index) {
        return { ...ing, [field]: value }
      }
      return ing
    })
    setEditingMeal({ ...editingMeal, Ingredients: updatedIngredients })
  }

  const handleAddEditIngredient = () => {
    setEditingMeal({
      ...editingMeal,
      Ingredients: [
        ...editingMeal.Ingredients,
        { ingredient: "", quantity: "" },
      ],
    })
  }

  const handleRemoveEditIngredient = (index) => {
    const updatedIngredients = editingMeal.Ingredients.filter(
      (_, i) => i !== index
    )
    setEditingMeal({ ...editingMeal, Ingredients: updatedIngredients })
  }

  const getFilteredAndSortedMeals = () => {
    let filteredMeals = [...meals]

    // Apply title search
    if (searchTitle) {
      filteredMeals = filteredMeals.filter((meal) =>
        meal.title.toLowerCase().includes(searchTitle.toLowerCase())
      )
    }

    // Apply category filter
    if (filterCategory) {
      filteredMeals = filteredMeals.filter(
        (meal) => meal.category === filterCategory
      )
    }

    // Apply sorting
    if (sortBy) {
      filteredMeals.sort((a, b) => {
        if (sortBy === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price
        } else if (sortBy === "title") {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title)
        }
        return 0
      })
    }

    return filteredMeals
  }

  const handleViewRecipe = (meal) => {
    setSelectedRecipe(meal)
    setShowRecipeModal(true)
  }

  const handleAddExisting = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await axios.post(
        import.meta.env.VITE_SERVER + "/api/meals/addMeal",
        selectedMeal
      )
      const response = await axios.get(
        import.meta.env.VITE_SERVER + "/api/meals/getAllMeals"
      )
      setMeals(response.data.Meals)
      setShowAddExistingForm(false)
      setSelectedMeal(null)
      toast.success("Meal added successfully!")
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred")
      toast.error(err.response?.data?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const searchMeals = async (term) => {
    setIsSearching(true)
    try {
      const response = await axios.get(`${MEALDB_API}${term}`)
      setSearchResults(response.data.meals || [])
    } catch (err) {
      console.error("Error fetching meals:", err)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleMealSelect = (meal) => {
    setSelectedMealDetails(meal)
    setSelectedMeal({
      price: "",
      description: "",
    })
    setShowMealDetailsModal(true)
  }

  return (
    <DefaultPage title="Menu Management" role="manager">
      <div className="flex flex-col">
        <div className="mb-6 grid grid-cols-5 gap-4 rounded-lg bg-white p-4 shadow-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search by Title
            </label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search meals..."
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">All Categories</option>
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">None</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
              disabled={!sortBy}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="flex items-end justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="transform rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg active:scale-95"
              >
                {showAddForm ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
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
                    Cancel
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Meal
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowAddExistingForm(true)}
                className="transform rounded-md bg-gradient-to-r from-green-500 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-teal-700 hover:shadow-lg active:scale-95"
              >
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Meal
                </span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoadingMeals
              ? [...Array(6)].map((_, index) => <MealSkeleton key={index} />)
              : getFilteredAndSortedMeals().map((meal) => (
                  <MealCard
                    key={meal._id}
                    meal={meal}
                    selectedMeal={selectedMeal}
                    onMealSelect={handleMealSelect}
                    onViewRecipe={handleViewRecipe}
                    onEditClick={handleEditClick}
                    onDeleteClick={(id) => setDeleteModalMeal(id)}
                  />
                ))}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          deleteModalMeal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-md transform rounded-lg bg-white p-6 text-center shadow-xl transition-all duration-300 ${
            deleteModalMeal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 p-2">
            <svg
              className="h-10 w-10 text-red-600"
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
          </div>
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            Delete Meal
          </h3>
          <p className="mb-6 text-gray-500">
            Are you sure you want to delete this meal? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDeleteModalMeal(null)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMeal}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showEditForm ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative max-h-[80vh] w-full max-w-2xl transform overflow-y-auto rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 ${
            showEditForm ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => {
              setShowEditForm(false)
              setEditingMeal(null)
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          <h2 className="mb-4 text-xl font-bold text-gray-900">Edit Meal</h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {editingMeal && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMeal.title}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editingMeal.image}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  />
                  {editingMeal.image && (
                    <div className="mt-2">
                      <img
                        src={editingMeal.image}
                        alt="Preview"
                        className="h-32 w-32 rounded-lg object-cover"
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/400")
                        }
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (₪)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingMeal.price}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, price: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={editingMeal.category}
                    onChange={(e) =>
                      setEditingMeal({
                        ...editingMeal,
                        category: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  required
                  value={editingMeal.description}
                  onChange={(e) =>
                    setEditingMeal({
                      ...editingMeal,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  rows="3"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Ingredients</h3>
                  <button
                    type="button"
                    onClick={handleAddEditIngredient}
                    className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                  >
                    Add Ingredient
                  </button>
                </div>

                {editingMeal.Ingredients.map((ing, index) => (
                  <div key={index} className="mt-3 flex items-center gap-4">
                    <input
                      type="text"
                      placeholder="Ingredient"
                      value={ing.ingredient}
                      onChange={(e) =>
                        handleEditIngredientChange(
                          index,
                          "ingredient",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={ing.quantity}
                      onChange={(e) =>
                        handleEditIngredientChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border border-gray-300 p-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEditIngredient(index)}
                      className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <h3 className="text-lg font-medium">Recipe</h3>
                <button
                  type="button"
                  onClick={() => setShowRecipeEditModal(true)}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  Edit Recipe
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false)
                    setEditingMeal(null)
                  }}
                  className="mt-6 w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating Meal...
                    </div>
                  ) : (
                    "Update Meal"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showAddForm ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showAddForm ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => {
              setShowAddForm(false)
              handleReset()
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Create New Meal
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMeal.title}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter meal title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (₪) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={newMeal.price}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, price: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                {isNewCategory ? (
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => handleNewCategorySubmit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter new category"
                  />
                ) : (
                  <select
                    required
                    value={newMeal.category}
                    onChange={handleCategoryChange}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Select Category</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                    <option value="new">+ Add New Category</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newMeal.image}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
                {newMeal.image && (
                  <div className="mt-2">
                    <img
                      src={newMeal.image}
                      alt="Preview"
                      className="h-32 w-32 rounded-lg object-cover"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/400")
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={newMeal.description}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, description: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                rows="3"
                placeholder="Enter meal description"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Ingredients <span className="text-red-500">*</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
                >
                  Add Ingredient
                </button>
              </div>

              {newMeal.Ingredients.map((ing, index) => (
                <div key={index} className="mt-3 flex items-center gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Ingredient"
                    value={ing.ingredient}
                    onChange={(e) =>
                      handleIngredientChange(
                        index,
                        "ingredient",
                        e.target.value
                      )
                    }
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Recipe</h3>
                <button
                  type="button"
                  onClick={() => {
                    setTempRecipe(newMeal.recipe)
                    setShowRecipeAddModal(true)
                  }}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  Add Recipe
                </button>
              </div>

              {newMeal.recipe && (
                <div className="mt-3 rounded-lg bg-gray-50 p-4">
                  <p className="text-gray-600">{newMeal.recipe}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  handleReset()
                }}
                className="mt-6 w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-lg bg-indigo-600 py-2 text-white transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Meal...
                  </div>
                ) : (
                  "Create Meal"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showAddExistingForm ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative h-[90vh] w-full max-w-6xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showAddExistingForm ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => setShowAddExistingForm(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Add Meal from TheMealDB
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Search Meals
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value
                  setSearchTerm(value)

                  // Filter meals locally
                  if (!value.trim()) {
                    setSearchResults(allMealDBMeals) // Show all meals if search is empty
                  } else {
                    const filtered = allMealDBMeals.filter(
                      (meal) =>
                        meal.strMeal
                          .toLowerCase()
                          .includes(value.toLowerCase()) ||
                        meal.strCategory
                          .toLowerCase()
                          .includes(value.toLowerCase())
                    )
                    setSearchResults(filtered)
                  }
                }}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Search for meals..."
              />
            </div>
          </div>

          <div className="h-[calc(90vh-160px)] overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No meals found</p>
            ) : (
              <div className="grid grid-cols-3 gap-6 p-4">
                {searchResults.map((meal) => (
                  <div
                    key={meal.idMeal}
                    onClick={() => {
                      handleMealSelect(meal)
                    }}
                    className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full">
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 w-full p-4">
                        <h3 className="text-lg font-semibold text-white">
                          {meal.strMeal}
                        </h3>
                        <p className="text-sm text-gray-200">
                          Category: {meal.strCategory}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showRecipeModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showRecipeModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => {
              setShowRecipeModal(false)
              setSelectedRecipe(null)
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          {selectedMealDetails && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                {selectedMealDetails.strMeal} - Recipe Instructions
              </h2>

              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <p className="whitespace-pre-line text-gray-600">
                  {selectedMealDetails.strInstructions}
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showRecipeEditModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showRecipeEditModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => setShowRecipeEditModal(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          <h2 className="mb-4 text-xl font-bold text-gray-900">Edit Recipe</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipe Instructions
              </label>
              <textarea
                value={editingMeal?.recipe || ""}
                onChange={(e) =>
                  setEditingMeal({ ...editingMeal, recipe: e.target.value })
                }
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                rows="10"
                placeholder="Enter the recipe instructions..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowRecipeEditModal(false)}
                className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowRecipeEditModal(false)}
                className="w-full rounded-lg bg-blue-600 py-2 text-white transition-all hover:bg-blue-700"
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showRecipeAddModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showRecipeAddModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => setShowRecipeAddModal(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          <h2 className="mb-4 text-xl font-bold text-gray-900">Add Recipe</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipe Instructions
              </label>
              <textarea
                value={tempRecipe}
                onChange={(e) => setTempRecipe(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                rows="10"
                placeholder="Enter the recipe instructions..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowRecipeAddModal(false)}
                className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewMeal({ ...newMeal, recipe: tempRecipe })
                  setShowRecipeAddModal(false)
                }}
                className="w-full rounded-lg bg-blue-600 py-2 text-white transition-all hover:bg-blue-700"
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showMealDetailsModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative max-h-[80vh] w-full max-w-2xl transform overflow-y-auto rounded-lg bg-white shadow-xl transition-all duration-300 ${
            showMealDetailsModal
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          }`}
        >
          {selectedMealDetails && (
            <>
              <div className="relative h-72 w-full">
                <img
                  src={selectedMealDetails.strMealThumb}
                  alt={selectedMealDetails.strMeal}
                  className="h-full w-full rounded-t-lg object-cover"
                />
                <button
                  onClick={() => setShowMealDetailsModal(false)}
                  className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white"
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
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMealDetails.strMeal}
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Category: {selectedMealDetails.strCategory}
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setShowDescriptionModal(true)}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    Add Description
                  </button>
                  <button
                    onClick={() => setShowPriceModal(true)}
                    className="rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
                  >
                    Set Price
                  </button>
                </div>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Ingredients:
                    </h3>
                    <button
                      onClick={() => setShowRecipeModal(true)}
                      className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                    >
                      View Recipe
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 20 }).map((_, index) => {
                      const ingredient =
                        selectedMealDetails[`strIngredient${index + 1}`]
                      const measure =
                        selectedMealDetails[`strMeasure${index + 1}`]

                      // Only show if both ingredient and measure exist and aren't empty
                      if (
                        ingredient &&
                        measure &&
                        ingredient.trim() &&
                        measure.trim()
                      ) {
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2"
                          >
                            <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                            <span className="font-medium text-gray-700">
                              {ingredient}
                            </span>
                            <span className="text-gray-500">-</span>
                            <span className="text-gray-600">{measure}</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  {addMealError && (
                    <div className="mb-3 text-center">
                      <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-500">
                        {addMealError}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowMealDetailsModal(false)}
                      className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        setAddMealError(null)
                        try {
                          if (!selectedMeal?.price) {
                            setAddMealError(
                              "Please set a price before adding the meal"
                            )
                            return
                          }

                          if (!selectedMeal?.description) {
                            setAddMealError(
                              "Please add a description before adding the meal"
                            )
                            return
                          }

                          setIsAddingMeal(true)

                          // Convert ingredients from API format to your schema format
                          const formattedIngredients = Array.from({
                            length: 20,
                          })
                            .map((_, index) => {
                              const ingredient =
                                selectedMealDetails[`strIngredient${index + 1}`]
                              const measure =
                                selectedMealDetails[`strMeasure${index + 1}`]

                              if (
                                ingredient &&
                                measure &&
                                ingredient.trim() &&
                                measure.trim()
                              ) {
                                return {
                                  ingredient: ingredient.trim(),
                                  quantity: measure.trim(),
                                }
                              }
                              return null
                            })
                            .filter(Boolean)

                          const mealData = {
                            title: selectedMealDetails.strMeal,
                            description: selectedMeal.description,
                            price: Number(selectedMeal.price),
                            image: selectedMealDetails.strMealThumb,
                            category:
                              selectedMealDetails.strCategory.toLowerCase(),
                            Ingredients: formattedIngredients,
                            recipe:
                              selectedMealDetails.strInstructions ||
                              "improvise",
                          }

                          await axios.post(
                            import.meta.env.VITE_SERVER + "/api/meals/addMeal",
                            mealData
                          )

                          toast.success("Meal added successfully!")
                          setShowMealDetailsModal(false)
                          setShowAddExistingForm(false)
                          fetchMeals()
                        } catch (error) {
                          console.error("Error adding meal:", error)
                          setAddMealError(
                            error.response?.data?.message ||
                              error.message ||
                              "Failed to add meal. Please try again."
                          )
                        } finally {
                          setIsAddingMeal(false)
                        }
                      }}
                      disabled={isAddingMeal}
                      className={`w-full rounded-lg py-2 text-white transition-all ${
                        isAddingMeal
                          ? "cursor-not-allowed bg-indigo-400"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isAddingMeal ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        "Add This Meal"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showRecipeModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showRecipeModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <button
            onClick={() => {
              setShowRecipeModal(false)
              setSelectedRecipe(null)
            }}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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

          {selectedMealDetails && (
            <>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                {selectedMealDetails.strMeal} - Recipe Instructions
              </h2>

              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <p className="whitespace-pre-line text-gray-600">
                  {selectedMealDetails.strInstructions}
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showDescriptionModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showDescriptionModal
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          }`}
        >
          <h3 className="mb-4 text-lg font-semibold">Add Description</h3>
          <textarea
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            className="h-32 w-full rounded-lg border p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meal description..."
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setShowDescriptionModal(false)}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSelectedMeal((prev) => ({
                  ...prev,
                  description: tempDescription,
                }))
                setShowDescriptionModal(false)
              }}
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[90] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showPriceModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
            showPriceModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h3 className="mb-4 text-lg font-semibold">Set Price</h3>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₪</span>
            <input
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              className="w-full rounded-lg border py-2 pl-8 pr-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setShowPriceModal(false)}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSelectedMeal((prev) => ({ ...prev, price: tempPrice }))
                setShowPriceModal(false)
              }}
              className="flex-1 rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </DefaultPage>
  )
}

export default MenuManagement
