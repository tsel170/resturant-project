import { motion, AnimatePresence } from "framer-motion"
import { AuthContext } from "../../context/AuthContext"
import { useContext, useState, useEffect } from "react"

const OrderModal = ({
  isOpen,
  onClose,
  onSubmit,
  tableNumber,
  meals,
  isVisible,
}) => {
  const [newOrder, setNewOrder] = useState({
    meals: [],
    tableNumber: tableNumber,
    ready: false,
    paid: false,
  })

  const { orders, fetchOrsers, user } = useContext(AuthContext)

  const [mealSearch, setMealSearch] = useState("")
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [order, setOrder] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    console.log("Available meals:", meals)
  }, [meals])

  useEffect(() => {
    console.log("Current order items:", newOrder.meals)
  }, [newOrder.meals])

  const filteredMeals = mealSearch
    ? meals.filter((meal) =>
        meal.title.toLowerCase().includes(mealSearch.toLowerCase())
      )
    : meals

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal)
    setMealSearch(meal.title)
    setOrder([...order, meal])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderWithTimestamp = {
        ...newOrder,
        BonDate: new Date(),
        branch: "676e884378317a74ac0817b2",
        user: user._id,
        tableNumber: tableNumber,
        ready: false,
        paid: false,
      }

      await onSubmit(orderWithTimestamp)

      setNewOrder({
        meals: [],
        tableNumber,
        ready: false,
        paid: false,
      })
    } catch (error) {
      console.error("Error submitting order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = (meal) => {
    setNewOrder((prev) => ({
      ...prev,
      meals: [...prev.meals, { ...meal, quantity: 1, note: "" }],
    }))
  }

  const updateItem = (index, field, value) => {
    console.log("Updating item:", { index, field, value })
    setNewOrder((prev) => {
      const updatedOrder = {
        ...prev,
        meals: prev.meals.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }
      console.log("Updated newOrder:", updatedOrder)
      return updatedOrder
    })
  }

  const removeItem = (index) => {
    setNewOrder((prev) => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index),
    }))
  }

  const handleAddMeal = (selectedMeal) => {
    console.log("Selected meal:", selectedMeal)

    const newMeal = {
      meal: selectedMeal._id,
      title: selectedMeal.title,
      quantity: 1,
      price: selectedMeal.price,
      note: "",
      image: selectedMeal.image || "/default-meal.png",
    }
    addItem(newMeal)
    setOrder((prevOrder) => [...prevOrder, newMeal])
    setMealSearch("")
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <motion.div
        className={`min-w-[40%] transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        layout
      >
        <h2 className="mb-4 text-xl font-bold">
          New Order - Table {tableNumber}
        </h2>

        <form onSubmit={handleSubmit} noValidate={false}>
          <motion.div
            className="h-[400px] space-y-4 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarGutter: "stable",
            }}
          >
            <style jsx global>{`
              .space-y-4::-webkit-scrollbar {
                width: 6px;
              }
              .space-y-4::-webkit-scrollbar-track {
                background: transparent;
              }
              .space-y-4::-webkit-scrollbar-thumb {
                background-color: #e5e7eb;
                border-radius: 20px;
              }
              .space-y-4::-webkit-scrollbar-thumb:hover {
                background-color: #d1d5db;
              }
            `}</style>

            <div className="relative mb-4">
              <input
                type="text"
                value={mealSearch}
                onChange={(e, value) => {
                  setMealSearch(e.target.value)
                  const mealNames = meals.map((meal) => meal.title)
                  if (mealNames.includes(e.target.value)) {
                    handleAddMeal(e.target.value)
                  }
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search for a meal..."
                className="w-full rounded-lg border p-2"
                autoComplete="off"
              />

              {mealSearch !== undefined && isSearchFocused && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                  {filteredMeals.map((meal) => (
                    <div
                      key={meal._id}
                      onClick={() => {
                        if (!meal.available) return
                        setMealSearch(meal.title)
                        handleAddMeal(meal)
                      }}
                      className={`flex items-center gap-3 p-2 ${
                        meal.available
                          ? "cursor-pointer hover:bg-gray-100"
                          : "cursor-not-allowed bg-gray-50 opacity-50"
                      }`}
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-grow items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{meal.title}</span>
                          <span className="text-sm text-gray-500">
                            ₪{meal.price}
                          </span>
                        </div>
                        {!meal.available && (
                          <span className="text-sm text-red-500">
                            (Unavailable)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {newOrder.meals.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <div className="flex items-center gap-4 rounded-lg border p-3 hover:bg-gray-50">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={item.image || "/default-meal.png"}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/default-meal.png"
                        }}
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-gray-600">₪{item.price}</span>
                      </div>
                      <textarea
                        placeholder="Add notes..."
                        maxLength={500}
                        className="mt-1 w-full resize-none rounded-md border p-2 text-sm"
                        value={item.note}
                        onChange={(e) =>
                          updateItem(index, "note", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        className="w-16 rounded-md border p-2 text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* <motion.button
              layout
              type="button"
              onClick={addItem}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              + Add Item
            </motion.button> */}
          </motion.div>

          <div className="mt-4 flex justify-end gap-4 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={newOrder.meals.length === 0 || isSubmitting}
              className={`rounded-lg px-4 py-2 text-white transition-all ${
                newOrder.meals.length === 0 || isSubmitting
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
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
                  <span>Creating Order...</span>
                </div>
              ) : (
                "Create Order"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default OrderModal
