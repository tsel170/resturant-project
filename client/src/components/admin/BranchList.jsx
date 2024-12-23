import React from "react"

const BranchList = ({ branches, deleteBranch }) => {
  return (
    <ul className="space-y-4">
      {branches.map((branch, index) => (
        <li
          key={index}
          className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-4 shadow-md duration-200 hover:bg-gray-100 hover:shadow-lg"
        >
          <div className="text-lg font-semibold text-gray-800">
            {branch.branchName}
          </div>
          <p className="text-sm text-gray-600">
            Address: <span className="font-bold">{branch.address}</span>
          </p>
          <p className="text-sm text-gray-600">
            Managers:
            <ul className="mt-2 space-y-1">
              {branch.managers && branch.managers.length > 0 ? (
                branch.managers.map((manager, managerIndex) => (
                  <li
                    key={managerIndex}
                    className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 shadow"
                  >
                    {manager.name} ({manager.email})
                  </li>
                ))
              ) : (
                <span className="text-gray-500"> No Managers Assigned</span>
              )}
            </ul>
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => deleteBranch(index)}
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              Delete Branch
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default BranchList
