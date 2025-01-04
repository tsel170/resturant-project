import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import TableCard from "../components/employee/TableCard"
import axios from "axios"
import DefaultPage from "../components/general/DefaultPage"

const TablesManagement = () => {
  const navigate = useNavigate()
  const { tables, updateTable, setTables } = useContext(AuthContext)

  const handleAssignTable = (table) => {
    updateTable(table.tableNumber, { isOccupied: !table.isOccupied })
  }

  return (
    <DefaultPage role={"employee"} title="Tables Management">
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
    </DefaultPage>
  )
}

export default TablesManagement
