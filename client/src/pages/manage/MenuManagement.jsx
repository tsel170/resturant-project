import React, { useEffect, useState } from "react"
import DefaultPage from "../../components/general/DefaultPage"
import axios from "axios"
import { toast } from "react-hot-toast"

const MenuManagement = () => {
  const [meals, setMeals] = useState([])
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMeal, setNewMeal] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    Ingredients: [{ ingredient: "", quantity: "" }],
    theDishPreparer: "chef",
  })
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isLoadingMeals, setIsLoadingMeals] = useState(true)
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

  const uniqueCategories = [...new Set(meals.map((meal) => meal.category))]

  // All possible categories from the schema

  // Combine default and existing categories, remove duplicates
  const allCategories = [...new Set([...uniqueCategories])]

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoadingMeals(true)
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/meals/getAllMeals"
        )
        setMeals(response.data.Meals)
      } catch (error) {
        console.error("Error fetching meals:", error)
      } finally {
        setIsLoadingMeals(false)
      }
    }

    fetchMeals()
  }, [])

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

    try {
      await axios.post(
        import.meta.env.VITE_SERVER + "/api/meals/addMeal",
        newMeal
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingMeals
              ? [...Array(6)].map((_, index) => <MealSkeleton key={index} />)
              : getFilteredAndSortedMeals().map((meal) => (
                  <div
                    key={meal._id}
                    className="group relative transform rounded-xl border border-gray-100 bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <h3 className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-indigo-600">
                        {meal.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {meal.description}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-indigo-600">
                        ₪{meal.price}
                      </p>
                      <p className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-sm text-indigo-600">
                        {meal.category}
                      </p>

                      <div className="mt-3 flex justify-between gap-2">
                        <button
                          onClick={() =>
                            setSelectedMeal(
                              selectedMeal === meal._id ? null : meal._id
                            )
                          }
                          className="w-full transform rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-blue-700 hover:shadow-md"
                        >
                          {selectedMeal === meal._id
                            ? "Hide Ingredients"
                            : "Show Ingredients"}
                        </button>
                        <button
                          onClick={() => handleViewRecipe(meal)}
                          className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-green-600"
                        >
                          Recipe
                        </button>
                        <button
                          onClick={() => handleEditClick(meal)}
                          className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteModalMeal(meal._id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          selectedMeal === meal._id
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="mt-3">
                          <h4 className="mb-2 font-medium text-gray-700">
                            Ingredients:
                          </h4>
                          <ul className="space-y-1">
                            {meal.Ingredients.map((ing) => (
                              <li
                                key={ing._id}
                                className="flex items-center rounded-lg bg-gray-50 px-2 py-1.5 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100"
                              >
                                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                                {ing.ingredient} - {ing.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
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
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
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
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newMeal.title}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (₪)
                </label>
                <input
                  type="number"
                  required
                  value={newMeal.price}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, price: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                {isNewCategory ? (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => handleNewCategorySubmit(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter new category"
                  />
                ) : (
                  <select
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                required
                value={newMeal.description}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, description: e.target.value })
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

          {selectedRecipe && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedRecipe.title} Recipe
              </h2>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Ingredients:
                </h3>
                <ul className="space-y-2">
                  {selectedRecipe.Ingredients.map((ing, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span className="font-medium">{ing.ingredient}</span>
                      <span className="mx-2">-</span>
                      <span>{ing.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Recipe:
                </h3>
                <p className="text-gray-600">{selectedRecipe.recipe}</p>
              </div>
            </div>
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
        className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
          showAddExistingForm ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
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
            Add Existing Meal
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Meal
              </label>
              <select
                value={selectedMeal?._id || ""}
                onChange={(e) => {
                  const meal = existingMeals.find(
                    (m) => m._id === e.target.value
                  )
                  setSelectedMeal(meal)
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select a meal</option>
                {existingMeals.map((meal) => (
                  <option key={meal._id} value={meal._id}>
                    {meal.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedMeal && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium">{selectedMeal.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedMeal.description}
                </p>
                <p className="mt-2 text-sm font-medium">
                  Price: ${selectedMeal.price}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowAddExistingForm(false)}
                className="w-full rounded-lg bg-gray-100 py-2 text-gray-700 transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddExisting}
                disabled={!selectedMeal || isLoading}
                className="w-full rounded-lg bg-green-600 py-2 text-white transition-all hover:bg-green-700 disabled:bg-green-300"
              >
                {isLoading ? "Adding..." : "Add Meal"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultPage>
  )
}

export default MenuManagement
