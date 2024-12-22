import React from "react"

const BranchList = ({ branches, deleteBranch }) => {
  return (
    <ul className="space-y-4">
      {branches.map((branch, index) => (
        <li
          key={index}
          className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-4 shadow-md hover:shadow-lg"
        >
          <div className="text-lg font-semibold text-gray-800">
            {branch.branchName}
          </div>
          <p className="text-sm text-gray-600">
            Address: <span className="font-bold">{branch.address}</span>
          </p>
          <div className="text-sm text-gray-600">
            <span className="font-bold">Tables:</span>
            <ul className="mt-2 space-y-2">
              {branch.tables.map((table, i) => (
                <li
                  key={i}
                  className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 shadow"
                >
                  Table {table.tableNumber} - {table.seats} Seats
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => deleteBranch(index)}
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

export default BranchList
