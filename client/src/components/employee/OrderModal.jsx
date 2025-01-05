import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

const OrderModal = ({ isOpen, onClose, onSubmit, tableNumber, meals }) => {
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

  const filteredMeals = meals.filter((meal) =>
    meal.title.toLowerCase().includes(mealSearch.toLowerCase())
  )

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal)
    setMealSearch(meal.title)
    setOrder([...order, meal])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const orderWithTimestamp = {
      ...newOrder,
      BonDate: new Date(),
      branch: "676e884378317a74ac0817b2",
      user: user._id, //TODO: get user id from context
      tableNumber: tableNumber,
      ready: false,
      paid: false,
    }
    console.log(orderWithTimestamp)

    onSubmit(orderWithTimestamp)

    setNewOrder({
      meals: [],
      tableNumber,
      ready: false,
      paid: false,
    })
    fetchOrsers()
  }

  const addItem = (meal) => {
    setNewOrder((prev) => ({
      ...prev,
      meals: [...prev.meals, { ...meal, quantity: 1, notes: "" }],
    }))
  }

  const updateItem = (index, field, value) => {
    setNewOrder((prev) => ({
      ...prev,
      meals: prev.meals.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const removeItem = (index) => {
    setNewOrder((prev) => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index),
    }))
  }

  const handleAddMeal = (selectedMeal) => {
    console.log(selectedMeal)

    const newMeal = {
      meal: selectedMeal._id,
      title: selectedMeal.title,
      quantity: 1,
      price: selectedMeal.price,
      notes: "",
    }
    addItem(newMeal)
    setOrder((prevOrder) => [...prevOrder, newMeal])

    setOrder((prev) => [...prev])
    setMealSearch("") // Clear search after selection
  }

  if (!isOpen) return null
  console.log({ mealSearch })
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div className="rounded-lg bg-white p-6" layout>
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
                placeholder="Search for a meal..."
                className="w-full rounded-lg border p-2"
                autoComplete="off"
              />

              {mealSearch && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                  {filteredMeals.map((meal) => (
                    <div
                      key={meal._id}
                      onClick={() => {
                        setMealSearch(meal.title)

                        handleAddMeal(meal)
                      }}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                    >
                      {meal.title}
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
                  <div className="flex items-center gap-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        placeholder="Meal name"
                        required
                        className="w-full rounded-md border p-2"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(index, "title", e.target.value)
                        }
                      />
                      <div className="mt-1 text-sm text-red-500" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      className="w-20 rounded-md border p-2"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value))
                      }
                    />
                    <textarea
                      placeholder="Meal notes..."
                      maxLength={500}
                      className="w-40 rounded-md border p-2"
                      value={item.notes}
                      onChange={(e) =>
                        updateItem(index, "notes", e.target.value)
                      }
                    />
                    {newOrder.meals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.button
              layout
              type="button"
              onClick={addItem}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              + Add Item
            </motion.button>
          </motion.div>

          <div className="mt-4 flex justify-end gap-4 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Create Order
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default OrderModal
