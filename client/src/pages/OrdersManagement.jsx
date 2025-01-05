import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import { AuthContext } from "../context/AuthContext"

const OrdersManagement = () => {
  const navigate = useNavigate()

  const { orders, setOrders } = useContext(AuthContext)
  console.log(orders)
  const handleDelivered = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.number === orderId ? { ...order, delivered: true } : order
      )
    )
  }

  const inProcessOrders = orders.filter((order) => !order.delivered)
  const deliveredOrders = orders.filter((order) => order.delivered)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center bg-slate-50 p-6">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)} // Navigate one page back
              className="rounded border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
            >
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Orders Management
            </h1>
          </div>

          <div className="grid h-4/5 grid-cols-2 gap-6">
            {/* In Process Orders Section */}
            <div className="overflow-y-auto rounded border border-gray-300 bg-blue-100 p-4 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                In Process
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {inProcessOrders.map((order) => (
                  <div
                    key={order.id}
                    className="transform rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                  >
                    <h3 className="font-bold text-gray-800">
                      Order #{order.bonNumber} for table {order.tableNumber}
                    </h3>
                    <ul className="ml-4 list-disc text-gray-700">
                      {order.meals?.map((item, index) => (
                        <li key={index}>
                          {item.mealTitle} {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleDelivered(order.id)}
                      className="mt-2 transform rounded bg-blue-500 px-4 py-2 text-white transition-transform hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
                    >
                      Delivered
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivered Orders Section */}
            <div className="overflow-y-auto rounded border border-gray-300 bg-green-100 p-4 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                Delivered
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
      <Footer />
    </div>
  )
}

export default OrdersManagement
