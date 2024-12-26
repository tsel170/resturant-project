import React from "react"

const Orders = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow hover:bg-gray-100">
      <h2 className="mb-4 text-xl font-bold text-gray-700">Orders</h2>

      <div className="grid gap-2">
        {["Order 1", "Order 2", "Order 3"].map((order, index) => (
          <div
            key={index}
            className="rounded border border-gray-300 bg-gray-50 p-2"
          >
            {order}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
