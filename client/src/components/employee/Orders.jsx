import React from "react"

const Orders = () => {
  // Sample order data - in a real app, this would come from props or API
  const orders = [
    {
      id: 1,
      customer: "John Doe",
      items: 3,
      total: 89.97,
      status: "Processing",
    },
    {
      id: 2,
      customer: "Jane Smith",
      items: 2,
      total: 45.5,
      status: "Delivered",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      items: 1,
      total: 29.99,
      status: "Pending",
    },
  ]

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md duration-200 hover:shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-800">
          {orders.length} orders
        </span>
      </div>

      <div className="grid gap-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2 hover:bg-gray-100"
          >
            <div className="space-y-0.5">
              <p className="font-medium text-gray-800">{order.customer}</p>
              <p className="text-sm text-gray-600">
                {order.items} items · ${order.total.toFixed(2)}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-sm ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "Processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
