import React, { useState, useEffect, useRef, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

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

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
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
      className="w-[800px] rounded-lg p-0"
      onClose={onClose}
    >
      <div className="p-4">
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
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors ${
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
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors ${
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

const AddShiftModal = ({ isOpen, onClose, selectedDate }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showEmployeeSelection, setShowEmployeeSelection] = useState(false)
  const [activeShiftType, setActiveShiftType] = useState(null)

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
        // You might want to add a toast/alert here to inform the user
        console.log("Employee already exists in this shift")
        return
      }

      setShifts((prev) => ({
        ...prev,
        [activeShiftType]: {
          ...prev[activeShiftType],
          users: [...prev[activeShiftType].users, employee],
        },
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you can handle the submission of the shifts data
    console.log("Submitting shifts:", {
      date: selectedDate,
      shifts,
    })
    onClose()
    // Reset shifts after submission
    setShifts(initialShiftState)
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
        className={`w-full max-w-2xl rounded-lg p-0 backdrop:bg-gray-800/60 backdrop:backdrop-blur-sm ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"} transition-all duration-200 ease-out`}
        onClose={onClose}
      >
        <div
          className={`p-6 ${isAnimating ? "translate-y-0" : "-translate-y-4"} transition-transform duration-200 ease-out`}
        >
          <h2 className="mb-4 text-xl font-semibold">
            Add Shifts for {selectedDate?.toLocaleDateString()}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/* AM Shift Section */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold">AM Shift</h3>
                  <p className="text-sm text-gray-600">08:00 - 15:00</p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleAddUserClick("am")}
                    className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Add Employee
                  </button>

                  <div className="max-h-40 overflow-y-auto">
                    {shifts.am.users.map((user, index) => (
                      <div
                        key={index}
                        className="mb-2 flex items-center justify-between rounded bg-gray-50 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={getWorkerAvatar(user.email, user.gender)}
                            alt={`Avatar for ${user.name}`}
                            className="h-8 w-8 rounded-full"
                          />
                          <span>{user.name}</span>
                          {user.jobTitle?.toLowerCase() === "waiter" ? (
                            <WaiterIcon />
                          ) : (
                            <ChefIcon />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser("am", user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PM Shift Section */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold">PM Shift</h3>
                  <p className="text-sm text-gray-600">15:00 - 22:00</p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleAddUserClick("pm")}
                    className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Add Employee
                  </button>

                  <div className="max-h-40 overflow-y-auto">
                    {shifts.pm.users.map((user, index) => (
                      <div
                        key={index}
                        className="mb-2 flex items-center justify-between rounded bg-gray-50 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={getWorkerAvatar(user.email, user.gender)}
                            alt={`Avatar for ${user.name}`}
                            className="h-8 w-8 rounded-full"
                          />
                          <span>{user.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser("pm", user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
    </>
  )
}

export default AddShiftModal
