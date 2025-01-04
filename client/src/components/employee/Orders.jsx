import React from "react"

const Orders = ({ params }) => {
  const { orders } = params
  console.log(orders)
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

      <div className="grid gap-2" key={orders.id}>
        {orders.map((order) => (
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
                order.ready
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.ready ? "ready" : "not ready"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
