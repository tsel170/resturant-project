import React, { useState, useEffect, useContext } from "react"
import axios from "axios"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const TableIcon = () => (
  <svg
    className="mx-auto h-12 w-12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8B4513"
    strokeWidth="2"
  >
    <rect x="3" y="8" width="18" height="2" rx="1" />
    <rect x="5" y="10" width="2" height="8" />
    <rect x="17" y="10" width="2" height="8" />
  </svg>
)

const ManagementTables = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newTable, setNewTable] = useState({
    tableNumber: 0,
    seats: 0,
  })
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [tableToDelete, setTableToDelete] = useState(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const [editingTable, setEditingTable] = useState(null)
  const [newSeats, setNewSeats] = useState(0)

  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState(null)
  const { tables, loading, error, branchId } = useContext(AuthContext)
  const filteredTables = tables.filter((table) =>
    table.tableNumber?.toString().includes(searchQuery.trim())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newTable.seats < 1) {
      setErrorMessage("Table must have at least 1 seat")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/branches/addTable`,
        { branchId: branchId, ...newTable }
      )
      const updatedTables = [...tables, response.data].sort(
        (a, b) => a.tableNumber - b.tableNumber
      )
      setTables(updatedTables)
      setIsModalOpen(false)
      setNewTable({ tableNumber: 0, seats: 0 })
      setErrorMessage(null)
    } catch (err) {
      console.error("Error creating table:", err)
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to create table. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTable = async (tableId) => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/branches/deleteTable`,
        {
          data: {
            branchId: branchId,
            tableNumber: tableId,
          },
        }
      )

      setTables((prevTables) =>
        prevTables.filter((table) => table.tableNumber !== tableId)
      )
      setDeleteModalOpen(false)
      setTableToDelete(null)
    } catch (err) {
      console.error("Error deleting table:", err)
      setDeleteError(
        err.response?.data?.message ||
          "Failed to delete table. Please try again."
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsEditing(true)
    setEditError(null)

    if (newSeats < 1) {
      setEditError("Table must have at least 1 seat")
      setIsEditing(false)
      return
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER}/api/branches/updateTableSeats`,
        {
          branchId: branchId,
          tableNumber: editingTable.tableNumber,
          newSeats: newSeats,
        }
      )

      const updatedTables = tables.map((table) =>
        table.tableNumber === editingTable.tableNumber
          ? { ...table, seats: newSeats }
          : table
      )
      setTables(updatedTables)
      setEditingTable(null)
    } catch (err) {
      console.error("Error updating table:", err)
      setEditError(
        err.response?.data?.message || "Failed to update table seats"
      )
    } finally {
      setIsEditing(false)
    }
  }

  if (loading)
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
        <Header role={"manager"} />
        <div className="flex flex-1">
          <Sidebar />
          <div className="mx-auto flex-1 content-center p-6">
            <div className="mb-6 flex justify-between">
              <h2 className="h-8 w-48 animate-pulse rounded bg-gray-200"></h2>
              <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="rounded-lg bg-white p-6 shadow-md">
                  <div className="mb-4 text-center">
                    <div className="mx-auto mb-3 h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
                    <div className="mx-auto mb-2 h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                    <div className="mx-auto mb-2 h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  if (error) return <div>Error: {error}</div>

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"manager"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <button
            onClick={() => navigate(-1)}
            className="group relative mr-6 flex items-center rounded-lg bg-white px-6 py-3 font-medium text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg active:scale-95"
          >
            <span className="absolute inset-0 flex h-full w-1 items-center">
              <span className="h-8 w-1 rounded-r bg-green-500 transition-all duration-200 group-hover:h-full"></span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Table Management
          </h2>
          <div className="mb-6 flex items-center justify-between">
            <div className="relative">
              <input
                type="text"
                placeholder="Search table number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Add Table
            </button>
          </div>

          {/* Add Table Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-xl font-bold">Add New Table</h3>
                <form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <div className="mb-4 rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Table Number
                    </label>
                    <input
                      type="number"
                      value={newTable.tableNumber}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          tableNumber: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded border p-2 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      value={newTable.seats}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          seats: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded border p-2 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false)
                        setNewTable({ tableNumber: 0, seats: 0 })
                      }}
                      className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex min-w-[80px] items-center justify-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
                    >
                      {isSubmitting ? (
                        <svg
                          className="h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                className="rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
              >
                <div className="mb-4 text-center">
                  <div className="mb-3 text-gray-600">
                    <TableIcon />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Table {table.tableNumber}
                  </h3>
                  <div className="mt-2 text-gray-600">{table.seats} Seats</div>
                  <div className="">
                    {"🪑".repeat(Math.round(table.seats / 2))}
                  </div>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingTable(table)
                      setNewSeats(table.seats)
                    }}
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setTableToDelete(table)
                      setDeleteModalOpen(true)
                    }}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {filteredTables.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500">
                No tables found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold">Delete Table</h3>

            {deleteError && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{deleteError}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="mb-4 text-gray-600">
              Are you sure you want to delete Table {tableToDelete?.tableNumber}
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setTableToDelete(null)
                  setDeleteError(null)
                }}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTable(tableToDelete.tableNumber)}
                disabled={isDeleting}
                className="flex min-w-[80px] items-center justify-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isDeleting ? (
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {editingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold">
              Edit Table {editingTable.tableNumber}
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700">
                  Number of Seats:
                </label>
                <input
                  type="number"
                  min="1"
                  value={newSeats}
                  onChange={(e) => setNewSeats(Number(e.target.value))}
                  required
                  disabled={isEditing}
                  className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none disabled:bg-gray-100"
                />
              </div>

              {/* Error Message */}
              {editError && (
                <div className="mb-4 rounded border border-red-400 bg-red-100 p-2 text-red-700">
                  {editError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTable(null)
                    setEditError(null)
                  }}
                  disabled={isEditing}
                  className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-800 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="relative rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditing ? (
                    <>
                      <span className="opacity-0">Save</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                      </div>
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagementTables
