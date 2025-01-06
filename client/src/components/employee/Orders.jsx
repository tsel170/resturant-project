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
      // Debug logging
      console.log("Checking order:", order._id, {
        isReady: order.ready,
        wasReady: previousOrder?.ready,
        isDelivered: order.delivered,
      })

      return (
        order.ready && !order.delivered && previousOrder && !previousOrder.ready
      )
    })

    // Debug logging
    console.log("Newly ready orders:", newlyReadyOrders)

    // Send notification for each newly ready order
    newlyReadyOrders.forEach((order) => {
      console.log("Sending notification for order:", order._id)
      sendNotification(`Order for Table ${order.tableNumber} is Ready! 🍽️`, {
        body: `Order #${order.bonNumber} is ready for delivery`,
        icon: "/favicon.ico", // Using favicon as temporary icon
        requireInteraction: true, // Keep notification until user interacts
        vibrate: [200, 100, 200],
      })
    })

    // Update previous orders reference
    previousOrders.current = JSON.parse(JSON.stringify(orders))
  }, [orders, sendNotification])

  // Sort orders: ready but not delivered first, then not ready, then delivered
  const sortedOrders = [...orders].sort((a, b) => {
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
          {orders.length} orders
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
