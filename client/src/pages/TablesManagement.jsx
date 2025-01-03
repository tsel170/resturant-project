import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import TableCard from "../components/employee/TableCard"
import axios from "axios"

const TablesManagement = () => {
  const navigate = useNavigate()
  const { tables, updateTable, setTables } = useContext(AuthContext)

  const handleAssignTable = (table) => {
    updateTable(table.tableNumber, { isOccupied: !table.isOccupied })
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="rounded-lg bg-white px-6 py-2.5 text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:bg-gray-100"
              >
                ← Back
              </button>
              <h1 className="text-4xl font-bold text-gray-800">
                Tables Management
              </h1>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables.map((table) => (
              <TableCard
                key={table.tableNumber}
                tableNumber={table.tableNumber}
                seats={table.seats}
                orders={table.orders}
                isOccupied={table.isOccupied}
                onAssign={() => handleAssignTable(table)}
                updateTable={updateTable}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TablesManagement
