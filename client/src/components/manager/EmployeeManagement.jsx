import React, { useState } from "react"
import EmployeeList from "./EmployeeList"
import AddEmployeeForm from "./AddEmployeeForm"

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  const addEmployee = ({ name, email, phone, gender, branch, jobTitle }) => {
    if (name && email && phone && gender && branch && jobTitle) {
      const newEmployee = {
        name,
        email,
        phone,
        gender,
        /* branch: branch || [],*/
        jobTitle,
        role: "employee",
      }
      setEmployees([...employees, newEmployee])
      setShowAddForm(false)
    }
  }

  const deleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index)
    setEmployees(updatedEmployees)
  }

  return (
    <div className="rounded-lg bg-blue-50 p-6 shadow duration-200 focus-within:bg-blue-100 focus-within:shadow-md hover:bg-blue-100 hover:shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-blue-600">
        Employee Management
      </h2>

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          Add Employee
        </button>
      )}

      {showAddForm && (
        <AddEmployeeForm
          addEmployee={addEmployee}
          cancelForm={() => setShowAddForm(false)}
        />
      )}

      <EmployeeList employees={employees} deleteEmployee={deleteEmployee} />
    </div>
  )
}

export default EmployeeManagement
