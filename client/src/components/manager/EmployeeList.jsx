import React from "react"

const EmployeeList = ({ employees, deleteEmployee }) => {
  return (
    <ul className="space-y-2">
      {employees.map((employee, index) => (
        <li
          key={index}
          className="flex flex-col gap-2 rounded bg-white p-4 shadow"
        >
          <div className="font-semibold">
            <span className="text-lg">{employee.name}</span> -{" "}
            <span className="text-blue-600">{employee.email}</span>
          </div>
          <p className="text-sm text-gray-600">
            Phone: <span className="font-bold">{employee.phone}</span>
          </p>
          <p className="text-sm text-gray-600">
            Gender: <span className="font-bold">{employee.gender}</span>
          </p>
          <p className="text-sm text-gray-600">
            Role: <span className="font-bold">{employee.role}</span>
          </p>
          {employee.branch && employee.branch.length > 0 && (
            <p className="text-sm text-gray-600">
              Branches:{" "}
              <span className="font-bold">{employee.branch.join(", ")}</span>
            </p>
          )}
          {employee.jobTitle && (
            <p className="text-sm text-gray-600">
              Job Title: <span className="font-bold">{employee.jobTitle}</span>
            </p>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => deleteEmployee(index)}
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

export default EmployeeList
