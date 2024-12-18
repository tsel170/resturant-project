import React from "react"
import "./style.css"
import AddOrder from "./AddOrder"

const Tables = ({ params }) => {
  const { tables, setAddOrderObject } = params

  const percent = (min, max) => {
    return (min / max) * 100
  }

  return (
    <div className="rounded-md bg-slate-100 p-4 shadow duration-200 hover:bg-slate-200 hover:shadow-lg">
      <h2 className="text-center font-bold">tables</h2>
      <ul>
        {tables.map((table, i) => (
          <li
            key={i}
            className="mt-6 rounded-md border border-gray-300 bg-lime-50 p-4 text-center font-semibold duration-200 hover:border-slate-400 hover:shadow-md"
          >
            table number: {table.number}
            {table.order.map((element, i) => {
              return (
                <li key={i} className="mt-3 flex flex-wrap justify-center">
                  <p>order number: {table.order[i]}</p>
                </li>
              )
            })}
            <button
              onClick={() => setAddOrderObject(table.number)}
              className="mt-1 border-spacing-2 rounded-md border border-slate-300 bg-green-300 p-2 duration-200 hover:scale-105 active:scale-95"
            >
              add order
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tables
