import React from "react"

const Tables = ({ params }) => {
  const { orders, tables } = params

  return (
    <div className="rounded-md bg-slate-100 p-4 shadow duration-200 hover:bg-slate-200 hover:shadow-lg">
      <h2 className="text-center font-bold">tables</h2>
      <ul>
        {tables.map((table) => (
          <li className="mt-6 rounded-md border border-gray-300 bg-lime-50 p-4 duration-200 hover:scale-105">
            table number: {table.number}
            {table.order.map((element, i) => {
              return (
                <>
                  <li>order number: {table.order[i]}</li>
                  <ul className="rounded-md bg-green-300 px-2">
                    {orders
                      .find((order) => order.number == table.order[i])
                      .items.map((item) => (
                        <li>{item}</li>
                      ))}
                  </ul>
                </>
              )
            })}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tables
