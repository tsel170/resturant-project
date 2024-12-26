import React from "react"

const TableCard = ({ tableNumber, orders }) => {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
      <h3 className="text-lg font-bold text-gray-800">Table {tableNumber}</h3>
      <div className="mt-4">
        <h4 className="font-medium text-gray-700">Orders:</h4>
        <ul className="ml-4 mt-2 list-disc text-gray-600">
          {orders.length > 0 ? (
            orders.map((orderNumber) => (
              <li key={orderNumber}>Order number {orderNumber}</li>
            ))
          ) : (
            <li>No orders yet</li>
          )}
        </ul>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="transform rounded bg-blue-500 px-4 py-2 text-white transition-transform hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700">
          Add Order
        </button>
        <button className="transform rounded bg-green-500 px-4 py-2 text-white transition-transform hover:scale-105 hover:bg-green-600 active:scale-95 active:bg-green-700">
          Pay
        </button>
      </div>
    </div>
  )
}

export default TableCard
