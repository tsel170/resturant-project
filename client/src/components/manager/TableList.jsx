import React from "react"

const TableList = ({ tables, deleteTable }) => {
  return (
    <ul className="space-y-4">
      {tables.map((table, index) => (
        <li
          key={index}
          className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-4 shadow-md duration-200 hover:bg-gray-100 hover:shadow-lg"
        >
          <div className="text-lg font-semibold text-gray-800">
            Table {table.tableNumber}
          </div>
          <div className="text-sm text-gray-600">Seats: {table.seats}</div>
          <div className="flex justify-end">
            <button
              onClick={() => deleteTable(index)}
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TableList
