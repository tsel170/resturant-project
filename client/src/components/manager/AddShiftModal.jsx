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
            .sort((a, b) => a.number - b.number)
            .map((table) => (
              <button
                key={table.number}
                onClick={() => handleTableToggle(table.number)}
                className={`group flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all duration-300 ${
                  selectedTables.includes(table.number)
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                }`}
              >
                <div className="mb-2 text-3xl font-semibold">
                  {table.number}
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1 transition-colors duration-300 ${
                    selectedTables.includes(table.number)
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

const AddShiftModal = ({ isOpen, onClose, selectedDate }) => {
  const { tables } = useContext(AuthContext)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showEmployeeSelection, setShowEmployeeSelection] = useState(false)
  const [activeShiftType, setActiveShiftType] = useState(null)
  const [showTableAssignment, setShowTableAssignment] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Initialize shifts with empty state
  const initialShiftState = {
    am: {
      users: [],
      startTime: "08:00",
      endTime: "15:00",
    },
    pm: {
      users: [],
      startTime: "15:00",
      endTime: "22:00",
    },
  }

  // Reset shifts when date changes
  useEffect(() => {
    setShifts(initialShiftState)
  }, [selectedDate])

  const [shifts, setShifts] = useState(initialShiftState)
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
      const isEmployeeAlreadyInShift = shifts[activeShiftType].users.some(
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
    setShifts((prev) => ({
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

    // Helper function to format users data
    const formatUsersData = (users) => {
      return users.map((user) => ({
        user: user.id, // Assuming this is the MongoDB _id
        table:
          user.jobTitle?.toLowerCase() === "waiter" ? user.assignedTables : [],
        startShift: null,
        endShift: null,
      }))
    }

    try {
      // Format AM shift request
      if (shifts.am.users.length > 0) {
        const amShiftData = {
          date: selectedDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
          timeShift: "am",
          users: formatUsersData(shifts.am.users),
        }

        await axios.post(
          import.meta.env.VITE_SERVER + "/api/shifts/addShift",
          amShiftData
        )
      }

      // Format PM shift request
      if (shifts.pm.users.length > 0) {
        const pmShiftData = {
          date: selectedDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
          timeShift: "pm",
          users: formatUsersData(shifts.pm.users),
        }

        await axios.post(
          "http://localhost:5000/api/shifts/addShift",
          pmShiftData
        )
      }

      onClose()
      // Reset shifts after successful submission
      setShifts({
        am: { users: [], startTime: "08:00", endTime: "15:00" },
        pm: { users: [], startTime: "15:00", endTime: "22:00" },
      })
    } catch (error) {
      console.error("Error saving shifts:", error)
      // You might want to add error handling/notification here
    }
  }

  const handleRemoveUser = (shiftType, userToRemove) => {
    console.log("Removing user:", userToRemove)
    console.log("From shift:", shiftType)
    console.log("Current shifts state:", shifts)

    setShifts((prevShifts) => {
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
  console.log("Current shifts:", shifts)
  console.log(
    "Current users for active shift:",
    activeShiftType ? shifts[activeShiftType].users : []
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
                    {shifts.am.users.map((user, index) => (
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
                    {shifts.pm.users.map((user, index) => (
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

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Save Shifts
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
        shifts={shifts}
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
