import React, { useState } from "react"
import TableList from "./TableList"
import AddTableForm from "./AddTableForm"

const TableManagement = () => {
  const [tables, setTables] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  const addTable = (tableNumber, seats) => {
    if (tableNumber && seats) {
      setTables([...tables, { tableNumber, seats }])
      setShowAddForm(false)
    }
  }

  const deleteTable = (index) => {
    const updatedTables = tables.filter((_, i) => i !== index)
    setTables(updatedTables)
  }

  return (
    <div className="rounded-lg bg-yellow-50 p-6 shadow duration-200 focus-within:bg-yellow-100 focus-within:shadow-md hover:bg-yellow-100 hover:shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-yellow-600">
        Table Management
      </h2>

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600"
        >
          Add Table
        </button>
      )}

      {/* Add Table Form */}
      {showAddForm && <AddTableForm params={{ addTable, setShowAddForm }} />}

      {/* Table List */}
      <TableList tables={tables} deleteTable={deleteTable} />
    </div>
  )
}

export default TableManagement
