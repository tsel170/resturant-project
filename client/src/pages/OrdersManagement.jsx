import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import DefaultPage from "../components/general/DefaultPage"

const OrdersManagement = () => {
  const navigate = useNavigate()

  const { orders, setOrders } = useContext(AuthContext)
  console.log(orders)
  const handleDelivered = (id) => {
    axios.put(
      `${import.meta.env.VITE_SERVER}/api/bons/updateDeliveredBon/${id}`
    )
    setOrders(
      orders.map((order) =>
        order.number === id ? { ...order, delivered: true } : order
      )
    )
  }

  // Filter for unpaid orders only
  const unpaidOrders = orders.filter((order) => !order.paid)

  const inProcessOrders = unpaidOrders.filter((order) => !order.delivered)
  const deliveredOrders = unpaidOrders.filter((order) => order.delivered)

  const calculateExpectedTime = (meals) => {
    return meals.reduce((total, meal) => total + 7 * meal.quantity, 0)
  }

  const [timeElapsed, setTimeElapsed] = useState({})

  const calculateTimeElapsed = (orderDate) => {
    const now = new Date()
    const orderTime = new Date(orderDate)
    const diffSeconds = Math.floor((now - orderTime) / 1000)

    return {
      text:
        diffSeconds < 60
          ? `${diffSeconds}s`
          : diffSeconds < 3600
            ? `${Math.floor(diffSeconds / 60)}m`
            : `${Math.floor(diffSeconds / 3600)}h ${Math.floor((diffSeconds % 3600) / 60)}m`,
      seconds: diffSeconds,
    }
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
  }, [orders])

  const [sortBy, setSortBy] = useState("bonNumber")
  const [sortOrder, setSortOrder] = useState("asc")

  const sortOrders = (ordersToSort) => {
    return [...ordersToSort].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "table":
          comparison = a.tableNumber - b.tableNumber
          break
        case "time":
          comparison = new Date(a.date) - new Date(b.date)
          break
        case "bonNumber":
          comparison = a.bonNumber - b.bonNumber
          break
        default:
          comparison = 0
      }

      return sortOrder === "asc" ? comparison : -comparison
    })
  }

  // Apply sorting to both order lists
  const sortedInProcessOrders = sortOrders(inProcessOrders)
  const sortedDeliveredOrders = sortOrders(deliveredOrders)

  const handleSort = (by) => {
    setSortBy(by)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <DefaultPage title="Orders Management">
      <div className="flex h-[calc(100vh-theme(spacing.32))] flex-col overflow-auto p-6">
        {/* Sort Controls - Redesigned */}
        <div className="mb-4 min-h-fit">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Sort Orders</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSort("bonNumber")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  sortBy === "bonNumber"
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-700/10"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
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
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
                <span>Order Number</span>
                {sortBy === "bonNumber" && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                      }
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleSort("table")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  sortBy === "table"
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-700/10"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
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
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Table</span>
                {sortBy === "table" && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                      }
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleSort("time")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  sortBy === "time"
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-700/10"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Time</span>
                {sortBy === "time" && (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        sortOrder === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                      }
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid min-h-fit flex-1 grid-cols-2 gap-8">
          {/* In Process Orders Section */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <h2 className="mb-6 flex items-center justify-between border-b pb-4 text-2xl font-bold text-gray-800">
              In Process Orders
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500">
                {inProcessOrders.length} orders
              </span>
            </h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {sortedInProcessOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-lg border border-gray-200 p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.bonNumber}
                    </h3>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        Table {order.tableNumber}
                      </span>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                        Est: {calculateExpectedTime(order.meals)}m
                      </span>
                      {timeElapsed[order._id] && (
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            !timeElapsed[order._id]
                              ? "bg-gray-100 text-gray-600"
                              : (() => {
                                  const expectedSeconds =
                                    calculateExpectedTime(order.meals) * 60
                                  const elapsedSeconds =
                                    timeElapsed[order._id].seconds
                                  const percentage =
                                    (elapsedSeconds / expectedSeconds) * 100
                                  if (percentage <= 50)
                                    return "bg-green-100 text-green-800"
                                  if (percentage <= 75)
                                    return "bg-yellow-100 text-yellow-800"
                                  if (percentage <= 100)
                                    return "bg-orange-100 text-orange-800"
                                  return "bg-red-100 text-red-800"
                                })()
                          }`}
                        >
                          {timeElapsed[order._id]?.text || "0s"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    {order.meals?.map((meal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-100"
                      >
                        <span className="font-medium text-gray-700">
                          {meal.quantity}x {meal.mealTitle}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.ready && (
                    <button
                      onClick={() => handleDelivered(order._id)}
                      className="w-full rounded-lg bg-green-500 py-2.5 font-medium text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivered Orders Section */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <h2 className="mb-6 flex items-center justify-between border-b pb-4 text-2xl font-bold text-gray-800">
              Delivered Orders
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500">
                {deliveredOrders.length} orders
              </span>
            </h2>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {sortedDeliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-lg border border-gray-200 p-4 shadow-sm transition-colors"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.bonNumber}
                    </h3>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        Table {order.tableNumber}
                      </span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                        {timeElapsed[order._id]?.text}
                      </span>
                    </div>
                  </div>
                  <div className="justify-between space-y-2">
                    {order.meals?.map((meal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg p-3 transition-colors"
                      >
                        <span className="font-medium text-gray-700">
                          {meal.quantity}x {meal.mealTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultPage>
  )
}

export default OrdersManagement
