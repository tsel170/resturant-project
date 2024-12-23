import React from "react"

const EntityList = ({
  entities,
  type,
  deleteEntity,
  assignBranch,
  removeBranch,
}) => {
  return (
    <ul className="space-y-4">
      {entities.map((entity, index) => (
        <li
          key={index}
          className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-4 shadow-md duration-200 hover:bg-gray-100 hover:shadow-lg"
        >
          <div className="text-lg font-semibold text-gray-800">
            {entity.name}
          </div>
          <p className="text-sm text-gray-600">
            Email: <span className="font-bold">{entity.email}</span>
          </p>
          <p className="text-sm text-gray-600">
            Phone: <span className="font-bold">{entity.phone}</span>
          </p>
          <p className="text-sm text-gray-600">
            Gender:{" "}
            <span className="font-bold capitalize">{entity.gender}</span>
          </p>
          <p className="text-sm text-gray-600">
            Role: <span className="font-bold capitalize">{type}</span>
          </p>
          {type === "manager" && (
            <>
              <p className="text-sm text-gray-600">
                Branches:
                <ul className="mt-2 space-y-1">
                  {entity.branch && entity.branch.length > 0 ? (
                    entity.branch.map((branch, branchIndex) => (
                      <li
                        key={branchIndex}
                        className="flex items-center justify-between rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 shadow"
                      >
                        {branch.branchName}
                        <button
                          onClick={() => removeBranch(index, branchIndex)}
                          className="ml-4 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-500"> Not Assigned</span>
                  )}
                </ul>
              </p>
              <button
                onClick={() => assignBranch(index)}
                className="mt-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
              >
                Assign Branch
              </button>
            </>
          )}
          {type === "branch" && (
            <>
              <p className="text-sm text-gray-600">
                Managers:
                <ul className="mt-2 space-y-1">
                  {entity.managers && entity.managers.length > 0 ? (
                    entity.managers.map((manager, managerIndex) => (
                      <li
                        key={managerIndex}
                        className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 shadow"
                      >
                        {manager.name}
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-500"> No Managers</span>
                  )}
                </ul>
              </p>
            </>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => deleteEntity(type, index)}
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

export default EntityList
