import React from "react"
import { useNavigate } from "react-router-dom"

import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import TableCard from "../components/employee/TableCard"

const TablesManagement = () => {
  const navigate = useNavigate()

  const tables = [
    { number: 1, orders: [1, 2, 4, 6] },
    { number: 2, orders: [3, 5] },
    { number: 3, orders: [] },
    { number: 4, orders: [7, 8] },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center bg-slate-50 p-6">
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)} // Navigate one page back
              className="rounded border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
            >
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Tables Management
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {tables.map((table) => (
              <TableCard
                key={table.number}
                tableNumber={table.number}
                orders={table.orders}
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
