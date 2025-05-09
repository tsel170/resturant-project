import React, { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Tables = () => {
  const navigate = useNavigate()
  const { tables, branchId, fetchTables } = useContext(AuthContext)
  const [loadingTable, setLoadingTable] = useState(null)

  const getTableStyle = (occuipied) =>
    occuipied ? "bg-red-50 border-red-200 " : "bg-green-50 border-green-200 "

  const handleUpdateDiners = async (tableNumber, currentDiners, increment) => {
    const newDiners = increment ? currentDiners + 1 : currentDiners - 1
    if (newDiners < 1) return

    setLoadingTable(`${tableNumber}-${increment ? "inc" : "dec"}`)

    try {
      await axios.put(
        import.meta.env.VITE_SERVER + "/api/branches/updateTableDiners",
        {
          branchId,
          tableNumber,
          diners: newDiners,
        }
      )
      await fetchTables()
    } catch (error) {
      console.error("Error updating diners:", error)
    } finally {
      setLoadingTable(null)
    }
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Tables</h2>
        <button
          className="transform rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:translate-y-0"
          onClick={() => navigate("/tables")}
        >
          Manage Tables
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.tableNumber}
            className={`rounded-xl border-2 ${getTableStyle(
              table.occuipied
            )} p-4 text-center shadow-sm transition-all duration-200`}
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-700">
              Table {table.tableNumber}
            </h3>
            {table.occuipied ? (
              <div className="flex">
                <div className="flex-1">
                  <div className="mb-2 flex justify-center text-3xl">
                    {"👤".repeat(table.diners)}
                  </div>
                  <span className="block text-center text-gray-700">
                    {table.diners} diners
                  </span>
                </div>
                <div className="flex flex-col justify-center gap-3 pl-3">
                  <button
                    onClick={() =>
                      handleUpdateDiners(table.tableNumber, table.diners, true)
                    }
                    disabled={loadingTable === `${table.tableNumber}-inc`}
                    className="rounded-full bg-green-100 p-2.5 text-green-700 shadow-sm transition-all duration-150 hover:bg-green-200 hover:shadow-md active:scale-95 active:transform disabled:cursor-wait"
                  >
                    <span className="text-xl font-bold leading-none">
                      {loadingTable === `${table.tableNumber}-inc` ? (
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        "+"
                      )}
                    </span>
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateDiners(table.tableNumber, table.diners, false)
                    }
                    disabled={
                      table.diners <= 1 ||
                      loadingTable === `${table.tableNumber}-dec`
                    }
                    className={`rounded-full p-2.5 shadow-sm transition-all duration-150 ${
                      table.diners <= 1 ||
                      loadingTable === `${table.tableNumber}-dec`
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200 hover:shadow-md active:scale-95 active:transform"
                    }`}
                  >
                    <span className="text-xl font-bold leading-none">
                      {loadingTable === `${table.tableNumber}-dec` ? (
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        "-"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2 flex justify-center text-3xl">
                {"🪑".repeat(table.seats)}
              </div>
            )}
            <p className="mb-2 text-sm font-medium text-gray-600">
              {table.seats} seats
            </p>
            <p
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                table.occuipied
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {table.occuipied ? "Occupied" : "Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tables
