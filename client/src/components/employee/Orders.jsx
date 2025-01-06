import React from "react"

const Orders = ({ params }) => {
  const { orders } = params

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
