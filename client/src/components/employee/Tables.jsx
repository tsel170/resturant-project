import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const Tables = () => {
  // Status colors
  const getTableStyle = (isOccupied) =>
    isOccupied
      ? "bg-red-50 border-red-200 hover:bg-red-100"
      : "bg-green-50 border-green-200 hover:bg-green-100"

  // Example data - you can replace this with your actual table status data
  const { tables } = useContext(AuthContext)

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 border-b pb-3 text-2xl font-bold text-gray-800">
        Restaurant Tables
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`rounded-xl border-2 ${getTableStyle(
              table.isOccupied
            )} cursor-pointer p-4 text-center shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md`}
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Table {table.id}
            </h3>
            <div className="mb-2 flex justify-center text-3xl">
              {"🪑".repeat(table.seats / 2)}
            </div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              {table.seats} seats
            </p>
            <p
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                table.isOccupied
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {table.isOccupied ? "Occupied" : "Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tables
