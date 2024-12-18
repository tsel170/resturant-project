import React, { useState } from "react"

const TableManagement = () => {
  const [tables, setTables] = useState([])
  const [newTable, setNewTable] = useState("")

  const addTable = () => {
    if (newTable) {
      setTables([...tables, newTable])
      setNewTable("")
    }
  }

  const deleteTable = (index) => {
    const updatedTables = tables.filter((_, i) => i !== index)
    setTables(updatedTables)
  }

  return (
    <div className="rounded-lg bg-yellow-50 p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold text-yellow-600">
        Table Management
      </h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="Enter table number"
          className="flex-grow rounded-l-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <button
          onClick={addTable}
          className="rounded-r-md bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tables.map((table, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded bg-white p-2 shadow"
          >
            <span>Table {table}</span>
            <button
              onClick={() => deleteTable(index)}
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

export default TableManagement
