import React from "react"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import TableCard from "../components/employee/TableCard"

const TablesManagement = () => {
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
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            Tables Management
          </h1>
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
