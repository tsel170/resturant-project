import React from "react"

const Orders = ({ params }) => {
  const { orders, delivered } = params
  return orders.length > 0 ? (
    <div className="rounded-md bg-slate-100 p-4 shadow duration-200 hover:bg-slate-200 hover:shadow-lg">
      <h2 className="text-center font-bold">orders</h2>
      <ul>
        {orders.map(
          (order, i) =>
            !order.delivered && (
              <li
                key={i}
                className={`mt-6 rounded-md border border-gray-300 ${order.ready ? "bg-lime-100" : "bg-red-200"} p-4 font-semibold duration-200 hover:border-slate-400 hover:shadow-md`}
              >
                <p>order number: {order.number}</p>
                <p>for table: {order.table}</p>
                <ul
                  className={`rounded-md border-2 border-slate-400 bg-white p-3`}
                >
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {/* <input type="checkbox" /> */}
                      {item}
                    </li>
                  ))}
                </ul>
                {order.ready && (
                  <li className="mx-auto flex justify-center text-lg">
                    <button
                      onClick={() => delivered(i)}
                      className="mx-auto mt-2 rounded-md bg-cyan-300 p-2 text-center"
                    >
                      delivered
                    </button>
                  </li>
                )}
              </li>
            )
        )}
      </ul>
    </div>
  ) : (
    <></>
  )
}

export default Orders
