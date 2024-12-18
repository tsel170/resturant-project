import React from "react"

const Chef = ({ params }) => {
  const { orders, ready } = params

  return (
    <div className="rounded-lg bg-slate-50 p-6 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-red-600">
        Chef Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Not Ready Orders */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-red-500">
            Not Ready Orders
          </h2>
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 rounded-md border border-red-100 bg-red-50 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {orders.map(
                (order, i) =>
                  !order.ready && (
                    <div
                      key={order.number}
                      className="rounded-lg border border-red-300 bg-white p-4 shadow-sm duration-200 hover:shadow-md"
                    >
                      <p className="text-lg font-semibold">
                        Order Number: {order.number}
                      </p>
                      <p className="text-gray-600">
                        Table Number: {order.table}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="rounded bg-red-100 px-3 py-1 text-sm text-red-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => ready(i)}
                        className="mt-4 w-full rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                      >
                        Mark as Ready
                      </button>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500">
              No pending orders for preparation.
            </p>
          )}
        </div>

        {/* Ready but Not Delivered Orders */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-green-500">
            Ready but Not Delivered
          </h2>
          {orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 rounded-md border border-green-300 bg-green-50 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {orders.map(
                (order) =>
                  order.ready &&
                  !order.delivered && (
                    <div
                      key={order.number}
                      className="rounded-lg border border-green-300 bg-white p-4 shadow-sm duration-200 hover:shadow-md"
                    >
                      <p className="text-lg font-semibold text-green-600">
                        Order Number: {order.number}
                      </p>
                      <p className="text-gray-600">
                        Table Number: {order.table}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="rounded bg-green-100 px-3 py-1 text-sm text-green-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="mt-4 text-center text-gray-500">
              No ready orders to deliver.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chef
