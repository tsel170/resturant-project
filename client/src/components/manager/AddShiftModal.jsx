import React, { useState, useEffect, useRef, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const EmployeeSelectionPopup = ({
  isOpen,
  onClose,
  onSelect,
  activeShiftType,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const dialogRef = useRef(null)

  const { employees } = useContext(AuthContext)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  // Updated filter logic
  const employeesByTitle = (employees || [])
    .filter((employee) => {
      // First filter out managers
      if (employee?.role === "manager") return false

      // Then filter by shift type
      if (activeShiftType === "waiters") {
        return employee?.jobTitle === "Waiter"
      } else if (activeShiftType === "chefs") {
        return employee?.jobTitle === "Chef"
      }
      // Show all non-manager employees if no specific shift type
      return true
    })
    .reduce((acc, employee) => {
      const title = employee?.jobTitle || "Other"
      if (!acc[title]) {
        acc[title] = []
      }
      acc[title].push(employee)
      return acc
    }, {})

  return (
    <dialog ref={dialogRef} className="w-96 rounded-lg p-0" onClose={onClose}>
      <div className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Select Employee</h3>
        {Object.keys(employeesByTitle).length > 0 ? (
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {Object.entries(employeesByTitle).map(([title, employees]) => (
              <div key={title} className="space-y-2">
                <h4 className="font-medium text-gray-700">{title}</h4>
                <div className="space-y-1">
                  {employees.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => {
                        onSelect(employee)
                        onClose()
                      }}
                      className="w-full rounded px-3 py-2 text-left transition-colors hover:bg-gray-100"
                    >
                      {employee.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500">
            No employees available
          </p>
        )}
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
  const [shifts, setShifts] = useState({
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
    setActiveShiftType(shiftType)
    setShowEmployeeSelection(true)
  }

  const handleEmployeeSelect = (employee) => {
    if (activeShiftType) {
      setShifts((prev) => ({
        ...prev,
        [activeShiftType]: {
          ...prev[activeShiftType],
          users: [...prev[activeShiftType].users, employee.name],
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
  }

  const handleRemoveUser = (shiftType, userToRemove) => {
    setShifts((prev) => ({
      ...prev,
      [shiftType]: {
        ...prev[shiftType],
        users: prev[shiftType].users.filter((user) => user !== userToRemove),
      },
    }))
  }

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
                        <span>{user}</span>
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
                        <span>{user}</span>
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
      />
    </>
  )
}

export default AddShiftModal
