import React, { useState } from "react"

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [newEmployee, setNewEmployee] = useState("")

  const addEmployee = () => {
    if (newEmployee) {
      setEmployees([...employees, newEmployee])
      setNewEmployee("")
    }
  }

  const deleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index)
    setEmployees(updatedEmployees)
  }

  return (
    <div className="rounded-lg bg-blue-50 p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold text-blue-600">
        Employee Management
      </h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newEmployee}
          onChange={(e) => setNewEmployee(e.target.value)}
          placeholder="Enter employee name"
          className="flex-grow rounded-l-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={addEmployee}
          className="rounded-r-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {employees.map((employee, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded bg-white p-2 shadow"
          >
            <span>{employee}</span>
            <button
              onClick={() => deleteEmployee(index)}
              className="font-bold text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EmployeeManagement
