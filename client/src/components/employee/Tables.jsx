import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Tables = () => {
  const navigate = useNavigate()
  const getTableStyle = (isOccupied) =>
    isOccupied ? "bg-red-50 border-red-200 " : "bg-green-50 border-green-200 "

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
            )} p-4 text-center shadow-sm transition-all duration-200`}
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
      <div className="mt-6 flex justify-center">
        <button
          className="transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:translate-y-0"
          onClick={() => navigate("/tables")}
        >
          Manage Tables
        </button>
      </div>
    </div>
  )
}

export default Tables
