import React from "react"

const Delivered = ({ params }) => {
  console.log(params)

  const { orders } = params
  return orders.length > 0 ? (
    <div className="rounded-md bg-slate-100 p-4 shadow duration-200 hover:bg-slate-200 hover:shadow-lg">
      <h2 className="text-center font-bold">delivered orders</h2>
      <ul>
        {orders.map(
          (order, i) =>
            order.delivered && (
              <li
                key={i}
                className={`mt-6 rounded-md border border-gray-300 ${order.paid ? "bg-lime-100" : "bg-red-200"} p-4 font-semibold duration-200 hover:border-slate-400 hover:shadow-md`}
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
              </li>
            )
        )}
      </ul>
    </div>
  ) : (
    <></>
  )
}

export default Delivered
