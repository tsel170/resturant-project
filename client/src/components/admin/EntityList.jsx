import React from "react"

const EntityList = ({ entities, type, deleteEntity }) => {
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
          {type === "branch" ? (
            <p className="text-sm text-gray-600">
              Branch ID: <span className="font-bold">{entity.id || "N/A"}</span>
            </p>
          ) : null}
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
