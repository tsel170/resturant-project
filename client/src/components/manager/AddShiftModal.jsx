import React, { useState, useEffect, useRef, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

const WaiterIcon = () => (
  <svg
    className="h-5 w-5 text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M19 12c0 1.1-3.1 2-7 2s-7-.9-7-2" strokeLinecap="round" />
    <path d="M5 12c0-1.1 3.1-2 7-2s7 .9 7 2" strokeLinecap="round" />
    <path d="M5 12v3c0 1.1 3.1 2 7 2s7-.9 7-2v-3" strokeLinecap="round" />
    <line x1="12" y1="6" x2="12" y2="10" strokeLinecap="round" />
    <line x1="8" y1="7" x2="16" y2="7" strokeLinecap="round" />
  </svg>
)

const ChefIcon = () => (
  <svg
    className="h-5 w-5 text-orange-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      d="M12 4c-1.5 0-2.5 1-2.5 2.5c0-1-1-2-2.5-2S4 5.5 4 7c0 2.5 3 3 3 4l1 9h8l1-9c0-1 3-1.5 3-4c0-1.5-1.5-3-3-3S14 5.5 14 6.5C14 5 13 4 12 4z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const EmployeeSelectionPopup = ({
  isOpen,
  onClose,
  onSelect,
  activeShiftType,
  shifts,
}) => {
  const { employees } = useContext(AuthContext)
  const dialogRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      dialogRef.current?.showModal()
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        dialogRef.current?.close()
      }, 400) // Match this with the transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getWorkerAvatar = (email, gender) => {
    const defaultEmail = "default@example.com"
    const defaultGender = "male"
    const sanitizedEmail = encodeURIComponent(email ?? defaultEmail)
    const sanitizedGender = (gender ?? defaultGender).toLowerCase()
    const endpoint = sanitizedGender === "female" ? "girl" : "boy"
    return `https://avatar.iran.liara.run/public/${endpoint}?username=${sanitizedEmail}`
  }

  const waiters = (employees || []).filter(
    (employee) =>
      employee?.role !== "manager" &&
      employee?.jobTitle?.toLowerCase() === "waiter"
  )
  const chefs = (employees || []).filter(
    (employee) =>
      employee?.role !== "manager" &&
      employee?.jobTitle?.toLowerCase() === "chef"
  )

  // Helper function to check if employee is already in the shift
  const isEmployeeInShift = (employee) => {
    if (!activeShiftType || !shifts[activeShiftType]) return false
    return shifts[activeShiftType].users.some(
      (user) => user.email === employee.email
    )
  }

  return (
    <dialog
      ref={dialogRef}
      className={`w-[800px] rounded-lg p-0 backdrop:bg-gray-800/60 backdrop:backdrop-blur-sm ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"} duration-400 transition-all ease-out`}
    >
      <div
        className={`p-4 ${isAnimating ? "translate-y-0" : "-translate-y-4"} duration-400 transition-transform ease-out`}
      >
        <h3 className="mb-4 text-lg font-semibold">Select Employee</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Waiters Section */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Waiters</h4>
            <div className="max-h-96 space-y-1 overflow-y-auto">
              {waiters.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => {
                    onSelect(employee)
                    onClose()
                  }}
                  disabled={isEmployeeInShift(employee)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-all duration-300 ${
                    isEmployeeInShift(employee)
                      ? "cursor-not-allowed bg-gray-100 opacity-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={getWorkerAvatar(employee?.email, employee?.gender)}
                    alt={`Avatar for ${employee.name}`}
                    className="h-8 w-8 rounded-full"
                  />
                  {employee.name}
                  {isEmployeeInShift(employee) && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Already in shift)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chefs Section */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Chefs</h4>
            <div className="max-h-96 space-y-1 overflow-y-auto">
              {chefs.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => {
                    onSelect(employee)
                    onClose()
                  }}
                  disabled={isEmployeeInShift(employee)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-all duration-300 ${
                    isEmployeeInShift(employee)
                      ? "cursor-not-allowed bg-gray-100 opacity-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <img
                    src={getWorkerAvatar(employee?.email, employee?.gender)}
                    alt={`Avatar for ${employee.name}`}
                    className="h-8 w-8 rounded-full"
                  />
                  {employee.name}
                  {isEmployeeInShift(employee) && (
                    <span className="ml-2 text-sm text-gray-500">
                      (Already in shift)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  )
}

const TableAssignmentPopup = ({ isOpen, onClose, onConfirm }) => {
  const { tables } = useContext(AuthContext)
  const [selectedTables, setSelectedTables] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      dialogRef.current?.showModal()
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        dialogRef.current?.close()
      }, 400) // Match this with the transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleTableToggle = (tableNumber) => {
    setSelectedTables((prev) =>
      prev.includes(tableNumber)
        ? prev.filter((t) => t !== tableNumber)
        : [...prev, tableNumber]
    )
  }

  return (
    <dialog
      ref={dialogRef}
      className={`w-[800px] rounded-lg p-0 backdrop:bg-gray-800/60 backdrop:backdrop-blur-sm ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"} duration-400 transition-all ease-out`}
    >
      <div
        className={`p-6 ${isAnimating ? "translate-y-0" : "-translate-y-4"} duration-400 transition-transform ease-out`}
      >
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Assign Tables
        </h3>
        <div className="mb-4 grid grid-cols-4 gap-3">
          {(tables || [])
            .sort((a, b) => a.tableNumber - b.tableNumber)
            .map((table) => (
              <button
                key={table.tableNumber}
                onClick={() => handleTableToggle(table.tableNumber)}
                className={`group flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all duration-300 ${
                  selectedTables.includes(table.tableNumber)
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                }`}
              >
                <div className="mb-2 text-3xl font-semibold">
                  {table.tableNumber}
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1 transition-colors duration-300 ${
                    selectedTables.includes(table.tableNumber)
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {table.seats} seats
                  </span>
                </div>
              </button>
            ))}
        </div>
        <div className="flex justify-end gap-2 border-t pt-4">
          <button
            onClick={() => {
              setSelectedTables([])
              onClose()
            }}
            className="rounded-md px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(selectedTables)
              setSelectedTables([])
              onClose()
            }}
            className={`rounded-md px-4 py-2 transition-all duration-300 ${
              selectedTables.length === 0
                ? "cursor-not-allowed bg-gray-300"
                : "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
            }`}
            disabled={selectedTables.length === 0}
          >
            Confirm ({selectedTables.length} tables)
          </button>
        </div>
      </div>
    </dialog>
  )
}

const AddShiftModal = ({
  isOpen,
  onClose,
  selectedDate,
  shifts: allShifts,
  setShifts: setAllShifts,
  events,
  setEvents,
  fetchShifts,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showEmployeeSelection, setShowEmployeeSelection] = useState(false)
  const [activeShiftType, setActiveShiftType] = useState(null)
  const [showTableAssignment, setShowTableAssignment] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalShifts, setModalShifts] = useState({
    am: { users: [], startTime: "08:00", endTime: "15:00" },
    pm: { users: [], startTime: "15:00", endTime: "22:00" },
  })

  const dialogRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      dialogRef.current?.showModal()
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        dialogRef.current?.close()
      }, 200) // Match this with the transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleAddUserClick = (shiftType) => {
    console.log("Setting active shift type:", shiftType) // Debug log
    setActiveShiftType(shiftType)
    setShowEmployeeSelection(true)
  }

  const handleEmployeeSelect = (employee) => {
    if (activeShiftType) {
      // Check if employee already exists in the shift
      const isEmployeeAlreadyInShift = modalShifts[activeShiftType].users.some(
        (user) => user.email === employee.email
      )

      if (isEmployeeAlreadyInShift) {
        console.log("Employee already exists in this shift")
        return
      }

      // If employee is a waiter, show table assignment popup
      if (employee.jobTitle?.toLowerCase() === "waiter") {
        setSelectedEmployee(employee)
        setShowTableAssignment(true)
      } else {
        // For non-waiters, add directly to shift
        addEmployeeToShift(employee, [])
      }
    }
  }

  const addEmployeeToShift = (employee, tables = []) => {
    setModalShifts((prev) => ({
      ...prev,
      [activeShiftType]: {
        ...prev[activeShiftType],
        users: [
          ...prev[activeShiftType].users,
          {
            ...employee,
            assignedTables: tables,
          },
        ],
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formatUsersData = (users) => {
      return users.map((user) => ({
        user: user._id,
        startShift: null,
        endShift: null,
        table:
          user.jobTitle?.toLowerCase() === "waiter" ? user.assignedTables : [],
        tip: 0,
      }))
    }

    try {
      if (
        modalShifts.am.users.length === 0 &&
        modalShifts.pm.users.length === 0
      ) {
        throw new Error("Please add at least one employee to a shift")
      }

      let newShifts = []

      // Format AM shift request
      if (modalShifts.am.users.length > 0) {
        const amShiftData = {
          date: new Date(selectedDate).toISOString(),
          timeShift: "am",
          users: formatUsersData(modalShifts.am.users),
        }

        const amResponse = await axios.post(
          "http://localhost:5000/api/shifts/addShift",
          amShiftData
        )
        newShifts.push(amResponse.data)
      }

      // Format PM shift request
      if (modalShifts.pm.users.length > 0) {
        const pmShiftData = {
          date: new Date(selectedDate).toISOString(),
          timeShift: "pm",
          users: formatUsersData(modalShifts.pm.users),
        }

        const pmResponse = await axios.post(
          "http://localhost:5000/api/shifts/addShift",
          pmShiftData
        )
        newShifts.push(pmResponse.data)
      }

      // Update the shifts array directly
      //   setAllShifts((prevShifts) => {
      //     // Remove any existing shifts for this date
      //     const filteredShifts = prevShifts.filter(
      //       (shift) =>
      //         new Date(shift.date).toDateString() !== selectedDate.toDateString()
      //     )
      //     // Add the new shifts
      //     return [...filteredShifts, ...newShifts]
      //   })

      onClose()
      setModalShifts({
        am: { users: [], startTime: "08:00", endTime: "15:00" },
        pm: { users: [], startTime: "15:00", endTime: "22:00" },
      })
      fetchShifts
    } catch (error) {
      console.error("Error saving shifts:", error)
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save shifts"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveUser = (shiftType, userToRemove) => {
    console.log("Removing user:", userToRemove)
    console.log("From shift:", shiftType)
    console.log("Current shifts state:", modalShifts)

    setModalShifts((prevShifts) => {
      const updatedUsers = prevShifts[shiftType].users.filter(
        (user) => user.email !== userToRemove.email
      )

      console.log("Updated users array:", updatedUsers)

      return {
        ...prevShifts,
        [shiftType]: {
          ...prevShifts[shiftType],
          users: updatedUsers,
        },
      }
    })
  }

  const getWorkerAvatar = (email, gender) => {
    const defaultEmail = "default@example.com"
    const defaultGender = "male"
    const sanitizedEmail = encodeURIComponent(email ?? defaultEmail)
    const sanitizedGender = (gender ?? defaultGender).toLowerCase()
    const endpoint = sanitizedGender === "female" ? "girl" : "boy"
    return `https://avatar.iran.liara.run/public/${endpoint}?username=${sanitizedEmail}`
  }

  console.log("Active shift type:", activeShiftType)
  console.log("Current shifts:", modalShifts)
  console.log(
    "Current users for active shift:",
    activeShiftType ? modalShifts[activeShiftType].users : []
  )

  return (
    <>
      <dialog
        ref={dialogRef}
        className={`w-full max-w-5xl rounded-lg p-0 backdrop:bg-gray-800/60 backdrop:backdrop-blur-sm ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"} transition-all duration-200 ease-out`}
        onClose={onClose}
      >
        <div
          className={`p-6 ${isAnimating ? "translate-y-0" : "-translate-y-4"} transition-transform duration-200 ease-out`}
        >
          <h2 className="mb-6 text-2xl font-semibold">
            Add Shifts for {selectedDate?.toLocaleDateString()}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {/* AM Shift Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-semibold">AM Shift</h3>
                  <p className="text-sm text-gray-600">08:00 - 15:00</p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleAddUserClick("am")}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Add Employee
                  </button>

                  <div className="max-h-[400px] space-y-3 overflow-y-auto">
                    {modalShifts.am.users.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={getWorkerAvatar(user.email, user.gender)}
                            alt={`Avatar for ${user.name}`}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <span className="font-medium">{user.name}</span>
                            {user.jobTitle?.toLowerCase() === "waiter" &&
                              user.assignedTables?.length > 0 && (
                                <div className="mt-1 text-sm text-gray-500">
                                  Tables:{" "}
                                  {user.assignedTables
                                    .sort((a, b) => a - b)
                                    .join(", ")}
                                </div>
                              )}
                          </div>
                          {user.jobTitle?.toLowerCase() === "waiter" ? (
                            <WaiterIcon />
                          ) : (
                            <ChefIcon />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser("am", user)}
                          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PM Shift Section - Same structure as AM but with pm data */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-semibold">PM Shift</h3>
                  <p className="text-sm text-gray-600">15:00 - 22:00</p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleAddUserClick("pm")}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Add Employee
                  </button>

                  <div className="max-h-[400px] space-y-3 overflow-y-auto">
                    {modalShifts.pm.users.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={getWorkerAvatar(user.email, user.gender)}
                            alt={`Avatar for ${user.name}`}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <span className="font-medium">{user.name}</span>
                            {user.jobTitle?.toLowerCase() === "waiter" &&
                              user.assignedTables?.length > 0 && (
                                <div className="mt-1 text-sm text-gray-500">
                                  Tables:{" "}
                                  {user.assignedTables
                                    .sort((a, b) => a - b)
                                    .join(", ")}
                                </div>
                              )}
                          </div>
                          {user.jobTitle?.toLowerCase() === "waiter" ? (
                            <WaiterIcon />
                          ) : (
                            <ChefIcon />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser("pm", user)}
                          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && (
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
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={isLoading}
                className={`rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all ${isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700"}`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin text-white"
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
                    Saving...
                  </div>
                ) : (
                  "Save Shifts"
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <EmployeeSelectionPopup
        isOpen={showEmployeeSelection}
        onClose={() => setShowEmployeeSelection(false)}
        onSelect={handleEmployeeSelect}
        activeShiftType={activeShiftType}
        shifts={modalShifts}
      />

      <TableAssignmentPopup
        isOpen={showTableAssignment}
        onClose={() => {
          setShowTableAssignment(false)
          setSelectedEmployee(null)
        }}
        onConfirm={(tables) => {
          addEmployeeToShift(selectedEmployee, tables)
          setShowTableAssignment(false)
          setSelectedEmployee(null)
        }}
      />
    </>
  )
}

export default AddShiftModal
