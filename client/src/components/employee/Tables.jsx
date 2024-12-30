import React from "react"

const Tables = () => {
  // Status colors
  const getTableStyle = (isOccupied) =>
    isOccupied
      ? "bg-red-50 border-red-200 hover:bg-red-100"
      : "bg-green-50 border-green-200 hover:bg-green-100"

  // Example data - you can replace this with your actual table status data
  const tables = Array(9)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      isOccupied: Math.random() < 0.5, // Random status for demonstration
    }))

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 border-b pb-3 text-2xl font-bold text-gray-800">
        Restaurant Tables
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`rounded-xl border-2 ${getTableStyle(table.isOccupied)} cursor-pointer p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md`}
          >
            <div className="mb-2">
              <span className="text-3xl">🪑</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              Table {table.id}
            </h3>
            <p
              className={`mt-2 text-sm font-medium ${
                table.isOccupied ? "text-red-600" : "text-green-600"
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
