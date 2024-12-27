import React from "react"

const Tables = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow duration-200 hover:bg-gray-100">
      <h2 className="mb-4 text-xl font-bold text-gray-700">Tables</h2>
      <div className="grid grid-cols-3 gap-4">
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="rounded border border-gray-300 bg-gray-50 p-4 text-center"
            >
              Table {index + 1}
            </div>
          ))}
      </div>
    </div>
  )
}

export default Tables
