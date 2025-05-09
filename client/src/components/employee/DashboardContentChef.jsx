import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { AuthContext } from "../../context/AuthContext"

const DashboardContentChef = () => {
  const navigate = useNavigate()
  const { orders, setOrders } = useContext(AuthContext)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [duration, setDuration] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState({})

  console.log(orders)
  const ordersInMaking =
    orders?.filter(
      (order) =>
        order.delivered == false && order.ready == false && order.paid == false
    ) || []
  const readyOrders =
    orders?.filter(
      (order) => order.ready == true && order.delivered == false
    ) || []

  const handleMealClick = (meal) => {
    setSelectedMeal(meal)
    // Find the order that contains this meal
    const order = orders.find((order) =>
      order.meals.some((m) => m.meal._id === meal.meal._id)
    )
    // Calculate total duration for all meals in the order
    const totalDuration = order.meals.reduce(
      (total, m) => total + 5 * m.quantity,
      0
    )
    setDuration(totalDuration)
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

  const calculateTimeElapsed = (orderDate) => {
    const now = new Date()
    const orderTime = new Date(orderDate)
    const diffSeconds = Math.floor((now - orderTime) / 1000) // difference in seconds

    // Return both formatted string and raw seconds
    if (diffSeconds < 60)
      return { text: `${diffSeconds}s`, seconds: diffSeconds }
    if (diffSeconds < 3600)
      return { text: `${Math.floor(diffSeconds / 60)}m`, seconds: diffSeconds }
    return {
      text: `${Math.floor(diffSeconds / 3600)}h ${Math.floor((diffSeconds % 3600) / 60)}m`,
      seconds: diffSeconds,
    }
  }

  const calculateExpectedTime = (meals) => {
    return meals.reduce((total, meal) => total + 5 * meal.quantity, 0)
  }

  useEffect(() => {
    const updateTimes = () => {
      const times = {}
      orders?.forEach((order) => {
        times[order._id] = calculateTimeElapsed(order.date)
      })
      setTimeElapsed(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 60000)
    return () => clearInterval(interval)
  }, [orders])

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
                className={`rounded-lg border border-gray-200 p-4 shadow-sm transition-colors hover:bg-gray-50 ${
                  order.canceled ? "bg-gray-100" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.bonNumber}
                    {order.canceled && (
                      <span className="ml-2 rounded-full bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
                        Canceled
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.canceled
                          ? "bg-gray-200 text-gray-600"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      Table {order.tableNumber}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.canceled
                          ? "bg-gray-200 text-gray-600"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Est: {calculateExpectedTime(order.meals)}m
                    </span>
                    {timeElapsed[order._id] && (
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          order.canceled
                            ? "bg-gray-200 text-gray-600"
                            : calculateExpectedTime(order.meals) * 60 >
                                timeElapsed[order._id].seconds * 2
                              ? "bg-green-300"
                              : calculateExpectedTime(order.meals) * 60 >
                                  timeElapsed[order._id].seconds
                                ? "bg-yellow-300"
                                : "bg-red-300"
                        }`}
                      >
                        {timeElapsed[order._id].text}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  {order.meals?.map((meal, index) => (
                    <div
                      key={index}
                      className={`flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors ${
                        order.canceled ? "text-gray-500" : "hover:bg-gray-100"
                      }`}
                      onClick={() => !order.canceled && handleMealClick(meal)}
                    >
                      <span
                        className={`font-medium ${
                          order.canceled ? "text-gray-500" : "text-gray-700"
                        }`}
                      >
                        {meal.quantity}x {meal.meal.title}
                      </span>
                      {meal.note && !order.canceled && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-red-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {!order.canceled && (
                  <button
                    onClick={() => handleMarkAsReady(order)}
                    className="w-full rounded-lg bg-green-500 py-2.5 font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Mark Order as Ready
                  </button>
                )}
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
                className={`rounded-lg border border-gray-200 p-4 shadow-sm transition-colors ${
                  order.canceled ? "bg-gray-100" : ""
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.bonNumber}
                    {order.canceled && (
                      <span className="ml-2 rounded-full bg-gray-300 px-3 py-1 text-sm font-medium text-gray-700">
                        Canceled
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.canceled
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      Table {order.tableNumber}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.canceled
                          ? "bg-gray-200 text-gray-600"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      Est: {calculateExpectedTime(order.meals)}m
                    </span>
                    {timeElapsed[order._id] && (
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                          order.canceled
                            ? "bg-gray-200 text-gray-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {timeElapsed[order._id].text}
                      </span>
                    )}
                  </div>
                </div>
                <div className="justify-between space-y-2">
                  {order.meals?.map((meal, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between rounded-lg p-3 transition-colors ${
                        order.canceled ? "text-gray-500" : ""
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          order.canceled ? "text-gray-500" : "text-gray-700"
                        }`}
                      >
                        {meal.quantity} x {meal.meal.title}
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
                  {selectedMeal?.meal?.title}
                </h3>
                {selectedMeal?.note && (
                  <div className="mt-2 rounded-lg bg-yellow-50 p-3">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5 text-yellow-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      <span className="font-medium text-yellow-800">Note:</span>
                    </div>
                    <p className="mt-1 text-gray-700">{selectedMeal.note}</p>
                  </div>
                )}
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
