import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { AuthContext } from "../../context/AuthContext"

const DashboardContentChef = () => {
  const navigate = useNavigate()
  const { orders, setOrders } = useContext(AuthContext)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [duration, setDuration] = useState(0)
  console.log(orders)
  const ordersInMaking =
    orders?.filter(
      (order) => order.delivered == false && order.ready == false
    ) || []
  const readyOrders =
    orders?.filter(
      (order) => order.ready == true && order.delivered == false
    ) || []

  const handleMealClick = (meal) => {
    setSelectedMeal(meal)
    setIsPopupOpen(true)
  }

  const handleMarkAsReady = async (order) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/bons/updateReadyBon/${order._id}`
      )

      if (response.status === 200) {
        // Update local state to reflect the change
        const updatedOrders = orders.map((o) =>
          o._id === order._id ? { ...o, ready: true } : o
        )
        setOrders(updatedOrders)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      // You might want to add some error handling UI here
    }
  }

  return (
    <>
      <div className="grid h-full grid-cols-2 gap-8 p-6">
        {/* Left column - Orders in Making */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <h2 className="mb-6 flex items-center justify-between border-b pb-4 text-2xl font-bold text-gray-800">
            Orders In Making
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500">
              {ordersInMaking.length} orders
            </span>
          </h2>
          <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto">
            {ordersInMaking.map((order) => (
              <div
                key={order._id}
                className="rounded-lg border border-gray-200 p-4 shadow-sm transition-colors hover:bg-gray-50"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.bonNumber}
                  </h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    Table {order.tableNumber}
                  </span>
                </div>
                <div className="mb-4 space-y-2">
                  {order.meals?.map((meal, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-100"
                      onClick={() => handleMealClick(meal)}
                    >
                      <span className="font-medium text-gray-700">
                        {meal.quantity}x {meal.meal.title}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleMarkAsReady(order)}
                  className="w-full rounded-lg bg-green-500 py-2.5 font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Mark Order as Ready
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Ready Orders */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <h2 className="mb-6 flex items-center justify-between border-b pb-4 text-2xl font-bold text-gray-800">
            Ready Orders
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500">
              {readyOrders.length} orders
            </span>
          </h2>
          <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto">
            {readyOrders.map((order) => (
              <div
                key={order._id}
                className="rounded-lg border border-gray-200 p-4 shadow-sm transition-colors"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.bonNumber}
                  </h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    Table {order.tableNumber}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.meals?.map((meal, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg p-3 transition-colors"
                    >
                      <span className="font-medium text-gray-700">
                        {meal.quantity}x {meal.meal.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Recipe Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedMeal?.meal?.mealTitle}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    Preparation time:
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {duration} minutes
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
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

            {/* Ingredients Section */}
            <div className="mb-8">
              <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
                <span>Ingredients</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedMeal?.meal?.Ingredients?.map((ing, index) => (
                  <div
                    key={ing._id}
                    className="flex justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <span className="font-medium text-gray-700">
                      {ing.ingredient}
                    </span>
                    <span className="text-gray-600">{ing.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipe Section */}
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
                <span>Recipe</span>
                <div className="h-px flex-1 bg-gray-200"></div>
              </h4>
              <div className="prose max-w-none space-y-3">
                {selectedMeal?.meal?.recipe
                  ?.split("\r\n")
                  .map((step, index) => {
                    if (step.trim()) {
                      return (
                        <p
                          key={index}
                          className="leading-relaxed text-gray-700"
                        >
                          {step}
                        </p>
                      )
                    }
                    return null
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardContentChef
