import React, { useContext, useState } from "react"
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

  const inProcessOrders = orders.filter((order) => !order.delivered)
  const deliveredOrders = orders.filter((order) => order.delivered)

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
                        <span className="block text-sm text-gray-600">
                          Table {order.tableNumber}
                        </span>
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
