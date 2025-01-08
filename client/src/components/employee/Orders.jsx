import React, { useEffect, useRef } from "react"
import { useNotifications } from "../../hooks/useNotifications.jsx"

const Orders = ({ params }) => {
  const { orders } = params
  const { sendNotification } = useNotifications()
  const previousOrders = useRef([])

  // Debug logging
  useEffect(() => {
    console.log("Current orders:", orders)
    console.log("Previous orders:", previousOrders.current)
  }, [orders])

  // Check for newly ready orders
  useEffect(() => {
    const newlyReadyOrders = orders.filter((order) => {
      const previousOrder = previousOrders.current.find(
        (prev) => prev._id === order._id
      )

      return (
        order.ready &&
        !order.delivered &&
        !order.paid &&
        (!previousOrder || !previousOrder.ready)
      )
    })

    // Create alert for each newly ready order
    newlyReadyOrders.forEach((order) => {
      const alertDiv = document.createElement("div")
      alertDiv.id = `notification-${order._id}`
      alertDiv.className =
        "fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50"
      alertDiv.innerHTML = `
        <div class="flex items-center">
          <div class="py-1">
            <svg class="h-6 w-6 text-yellow-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <p class="font-bold">New Order Ready!</p>
            <p class="text-sm">Order #${order.bonNumber} for Table ${order.tableNumber} is ready for delivery</p>
          </div>
        </div>
      `

      // Add close button
      const closeButton = document.createElement("button")
      closeButton.className =
        "absolute top-0 right-0 mt-2 mr-2 text-yellow-700 hover:text-yellow-900"
      closeButton.innerHTML = "×"
      closeButton.onclick = () => document.body.removeChild(alertDiv)
      alertDiv.appendChild(closeButton)

      // Add to document
      document.body.appendChild(alertDiv)
    })

    // Update previous orders reference
    previousOrders.current = JSON.parse(JSON.stringify(orders))
  }, [orders])

  // Sort orders: ready but not delivered first, then not ready, then delivered
  // Only include unpaid orders in the sorting
  const sortedOrders = [...orders]
    .filter((order) => !order.paid) // Filter out paid orders
    .sort((a, b) => {
      // Ready but not delivered orders come first
      if (a.ready && !a.delivered && (!b.ready || b.delivered)) return -1
      if (b.ready && !b.delivered && (!a.ready || a.delivered)) return 1

      // Not ready orders come second
      if (!a.ready && !a.delivered && (b.ready || b.delivered)) return -1
      if (!b.ready && !b.delivered && (a.ready || a.delivered)) return 1

      // Delivered orders come last
      if (a.delivered && !b.delivered) return 1
      if (b.delivered && !a.delivered) return -1

      return 0
    })

  return (
    <div
      className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md duration-200"
      key={orders.id}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-800">
          {sortedOrders.length} orders
        </span>
      </div>

      <div className="grid gap-2">
        {sortedOrders.slice(0, 3).map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2"
          >
            <div className="space-y-0.5">
              <p className="font-medium text-gray-800">
                table number {order.tableNumber}
              </p>
              <p className="text-sm text-gray-600">
                {order.meals?.length} items
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-sm ${
                order.delivered
                  ? "bg-green-100 text-green-800"
                  : order.ready
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {order.delivered
                ? "delivered"
                : order.ready
                  ? "ready"
                  : "not ready"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
