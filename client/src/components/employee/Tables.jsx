import React from "react"

const Tables = () => {
  // Status colors
  const getTableStyle = (isOccupied) =>
    isOccupied ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"

  // Example data - you can replace this with your actual table status data
  const tables = Array(9)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      isOccupied: Math.random() < 0.5, // Random status for demonstration
    }))

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Restaurant Tables
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`rounded-lg border-2 ${getTableStyle(table.isOccupied)} p-3 text-center shadow-sm`}
          >
            <div className="mb-1">
              <span className="text-2xl">🪑</span>
            </div>
            <h3 className="text-base font-semibold text-gray-700">
              Table {table.id}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {table.isOccupied ? "Occupied" : "Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tables
