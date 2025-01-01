import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"
import { AuthContext } from "../../context/AuthContext"

const ManagementTables = () => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/branches/branch/:id/",
          user?.branch
        )
        console.log(response.data)
        if (false) {
          setTables(response.data.tables)
          setLoading(false)
        }
      } catch (err) {
        setError("Failed to fetch tables")
        setLoading(false)
        console.error("Error fetching tables:", err)
      }
    }

    // fetchTables()
  }, [])

  if (loading) return <div>Loading tables...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"manager"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Table Management
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Table Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.id} className="border-b">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Table {table.number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {table.capacity} seats
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          table.status === "available"
                            ? "bg-green-100 text-green-800"
                            : table.status === "occupied"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {table.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <button className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
                        Edit
                      </button>
                      <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ManagementTables
