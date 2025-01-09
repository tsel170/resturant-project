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

  return (
    <DefaultPage title="Orders Management">
      <div className="flex min-h-screen flex-col bg-slate-50">
        {/* <Navbar role={"employee"} /> */}
        <div className="flex flex-1">
          {/* <Sidebar /> */}
          <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
            <div className="grid h-full gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {/* In Process Orders Section */}
              <div className="overflow-y-auto rounded border border-gray-300 bg-blue-100 p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  In Process
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {inProcessOrders.map((order) => (
                    <div
                      key={order._id}
                      className="transform rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                    >
                      <h3 className="mb-2 font-bold text-gray-800">
                        Order #{order.bonNumber}
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-600">
                            Table {order.tableNumber}
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            Est: {calculateExpectedTime(order.meals)}m
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              !timeElapsed[order._id]
                                ? "text-gray-600"
                                : (() => {
                                    const expectedSeconds =
                                      calculateExpectedTime(order.meals) * 60
                                    const elapsedSeconds =
                                      timeElapsed[order._id].seconds
                                    const percentage =
                                      (elapsedSeconds / expectedSeconds) * 100

                                    if (percentage <= 50)
                                      return "bg-green-100 text-green-600"
                                    if (percentage <= 75)
                                      return "bg-yellow-100 text-yellow-600"
                                    if (percentage <= 100)
                                      return "bg-orange-100 text-orange-600"
                                    return "bg-red-100 text-red-600"
                                  })()
                            }`}
                          >
                            Waiting: {timeElapsed[order._id]?.text || "0s"}
                          </span>
                        </div>
                      </h3>
                      <ul className="ml-4 list-disc text-gray-700">
                        {order.meals?.map((item, index) => (
                          <li key={index}>
                            {item.mealTitle} {item.quantity}
                          </li>
                        ))}
                      </ul>
                      {order.ready && (
                        <button
                          onClick={() => handleDelivered(order._id)}
                          className="mt-2 transform rounded bg-blue-500 px-4 py-2 text-white transition-transform hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
                        >
                          Delivered
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivered Orders Section */}
              <div className="overflow-y-auto rounded border border-gray-300 bg-green-100 p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Delivered
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {deliveredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="transform rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                    >
                      <h3 className="font-bold text-gray-800">
                        Order #{order.bonNumber}
                      </h3>
                      <ul className="ml-4 list-disc text-gray-700">
                        {order.meals?.map((item, index) => (
                          <li key={index}>{item.mealTitle}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPage>
  )
}

export default OrdersManagement
