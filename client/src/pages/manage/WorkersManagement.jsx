import React, { useState, useEffect, useContext } from "react"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const WorkersManagement = () => {
  const navigate = useNavigate()
  const { employees, setEmployees } = useContext(AuthContext)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    gender: "",
    role: "",
    jobTitle: "",
    email: "",
    phone: "",
    password: "",
  })
  const [isClosing, setIsClosing] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [formError, setFormError] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEditModalClosing, setIsEditModalClosing] = useState(false)
  const [editEmployee, setEditEmployee] = useState({
    name: "",
    gender: "",
    role: "",
    jobTitle: "",
    email: "",
    phone: "",
  })
  const [editFormError, setEditFormError] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleteModalClosing, setIsDeleteModalClosing] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [sortBy, setSortBy] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const { isLoading } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)

  const handleSeeMore = (employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    setFormError("")

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/users/register`,
        newEmployee
      )
      const updatedUsers = await axios.get(
        import.meta.env.VITE_SERVER + "/api/users/users"
      )
      setEmployees(updatedUsers.data.users)

      setIsAddModalOpen(false)
      setNewEmployee({
        name: "",
        gender: "",
        role: "",
        jobTitle: "",
        email: "",
        phone: "",
        password: "",
      })
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Error adding employee. Please try again."
      )
      console.error("Error adding employee:", error)
    }
  }

  const handleCloseAddModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsAddModalOpen(false)
      setIsClosing(false)
    }, 300)
  }

  const handleCloseSeeMore = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setIsModalClosing(false)
    }, 300)
  }

  const handleEditProfile = (employee) => {
    setEditEmployee({
      name: employee.name,
      gender: employee.gender,
      role: employee.role,
      jobTitle: employee.jobTitle,
      email: employee.email,
      phone: employee.phone,
    })
    setIsEditModalOpen(true)
    setIsModalOpen(false)
  }

  const handleCloseEditModal = () => {
    setIsEditModalClosing(true)
    setTimeout(() => {
      setIsEditModalOpen(false)
      setIsEditModalClosing(false)
      setEditFormError("")
    }, 300)
  }

  const handleUpdateEmployee = async (e) => {
    e.preventDefault()
    setEditFormError("")
    setIsEditingEmployee(true)

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER}/api/users/updateUser/${selectedEmployee._id}`,
        editEmployee
      )

      // Update both the employees list and the selected employee
      const updatedUsers = await axios.get(
        import.meta.env.VITE_SERVER + "/api/users/users"
      )
      setEmployees(updatedUsers.data.users)

      // Update the selectedEmployee with the edited data
      const updatedEmployee = {
        ...selectedEmployee,
        ...editEmployee,
      }
      setSelectedEmployee(updatedEmployee)

      // Close edit modal and show updated details modal
      setIsEditModalOpen(false)
      setIsModalOpen(true)
    } catch (error) {
      setEditFormError(
        error.response?.data?.message ||
          "Error updating employee. Please try again."
      )
    } finally {
      setIsEditingEmployee(false)
    }
  }

  const handleDeleteClick = (employee) => {
    setUserToDelete(employee)
    setIsDeleteModalOpen(true)
    setIsModalOpen(false)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalClosing(true)
    setTimeout(() => {
      setIsDeleteModalOpen(false)
      setIsDeleteModalClosing(false)
      setUserToDelete(null)
    }, 300)
  }

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER}/api/users/deleteUser/${userToDelete._id}`
      )

      // Fetch updated users list
      const updatedUsers = await axios.get(
        import.meta.env.VITE_SERVER + "/api/users/users"
      )
      setEmployees(updatedUsers.data.users)

      handleCloseDeleteModal()
    } catch (error) {
      console.error("Error deleting employee:", error)
    }
  }

  const getFilteredEmployees = () => {
    return employees.filter((employee) => {
      const matchesSearch = employee.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      const matchesJobTitle = sortBy === "all" || employee.jobTitle === sortBy
      const matchesRole = roleFilter === "all" || employee.role === roleFilter

      return matchesSearch && matchesJobTitle && matchesRole
    })
  }

  const getWorkerAvatar = (email, gender) => {
    // Provide default values if email or gender is undefined
    const defaultEmail = "default@example.com"
    const defaultGender = "male"

    // Use nullish coalescing to handle undefined/null values
    const sanitizedEmail = encodeURIComponent(email ?? defaultEmail)
    const sanitizedGender = (gender ?? defaultGender).toLowerCase()

    // Choose the endpoint based on gender
    const endpoint = sanitizedGender === "female" ? "girl" : "boy"

    return `https://avatar.iran.liara.run/public/${endpoint}?username=${sanitizedEmail}`
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header role={"manager"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center bg-slate-50 p-8">
          <div className="mb-8">
            <div className="mb-6 flex items-center">
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
              <h2 className="text-3xl font-bold text-gray-800">
                Employees List
              </h2>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {roleFilter === "employee" && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  >
                    <option value="all">All Job Titles</option>
                    <option value="waiter">Waiters</option>
                    <option value="chef">Chefs</option>
                  </select>
                )}

                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value)
                    if (e.target.value !== "employee") {
                      setSortBy("all")
                    }
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                >
                  <option value="all">All Roles</option>
                  <option value="employee">Employees</option>
                  <option value="manager">Managers</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center rounded-lg bg-green-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-green-600 hover:shadow-lg active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Employee
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                    Job Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading
                  ? // Skeleton loading state
                    Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index} className="animate-pulse">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="h-4 w-32 rounded bg-gray-200"></div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="h-4 w-24 rounded bg-gray-200"></div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="h-4 w-20 rounded bg-gray-200"></div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="h-8 w-24 rounded bg-gray-200"></div>
                          </td>
                        </tr>
                      ))
                  : getFilteredEmployees().map((employee) => (
                      <tr
                        key={employee.id}
                        className="transition duration-150 hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getWorkerAvatar(
                                employee?.email,
                                employee?.gender
                              )}
                              alt={`Avatar for ${employee.name}`}
                              className="h-8 w-8 rounded-full"
                            />
                            <span>{employee.name}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {employee.role}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {employee.jobTitle || "none"}
                        </td>
                        <td className="space-x-2 whitespace-nowrap px-6 py-4">
                          <button
                            onClick={() => handleSeeMore(employee)}
                            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-600"
                          >
                            See More
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
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${isModalClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
        >
          <div
            className={`w-full max-w-2xl transform rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 ${isModalClosing ? "animate-slideOut" : "animate-slideIn"}`}
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedEmployee?.name}'s Profile
              </h3>
              <button
                onClick={handleCloseSeeMore}
                className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {selectedEmployee && (
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 mb-6 flex justify-center">
                  <img
                    src={getWorkerAvatar(
                      selectedEmployee?.email,
                      selectedEmployee?.gender
                    )}
                    alt={`Avatar for ${selectedEmployee.name}`}
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedEmployee.name}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedEmployee.gender || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedEmployee.role}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500">Job Title</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedEmployee.jobTitle || "N/A"}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedEmployee.email}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 transition-all duration-200 hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {selectedEmployee.phone || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={handleCloseSeeMore}
                className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 hover:shadow-md"
              >
                Close
              </button>
              <button
                onClick={() => handleEditProfile(selectedEmployee)}
                className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 hover:shadow-md"
              >
                Edit Profile
              </button>
              <button
                onClick={() => handleDeleteClick(selectedEmployee)}
                className="rounded-lg bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600 hover:shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
        >
          <div
            className={`w-full max-w-2xl transform rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 ${isClosing ? "animate-slideOut" : "animate-slideIn"}`}
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Add New Employee
              </h3>
              <button
                onClick={handleCloseAddModal}
                className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleAddEmployee}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.gender}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.role}
                  onChange={(e) => {
                    setNewEmployee({
                      ...newEmployee,
                      role: e.target.value,
                      // Reset job title when role changes
                      jobTitle:
                        e.target.value === "manager"
                          ? ""
                          : newEmployee.jobTitle,
                    })
                  }}
                >
                  <option value="">Select Role</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <select
                  required={newEmployee.role !== "manager"}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.jobTitle}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, jobTitle: e.target.value })
                  }
                  disabled={newEmployee.role === "manager"}
                >
                  <option value="">Select Job Title</option>
                  <option value="waiter">Waiter</option>
                  <option value="chef">Chef</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.phone}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, phone: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                />
              </div>
              {formError && (
                <div className="col-span-2 mb-4">
                  <p className="text-sm text-red-500">{formError}</p>
                </div>
              )}
              <div className="col-span-2 mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-green-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-green-600"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${
            isEditModalClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          <div
            className={`w-full max-w-2xl transform rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 ${
              isEditModalClosing ? "animate-slideOut" : "animate-slideIn"
            }`}
          >
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Edit Employee Profile
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="rounded-full p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleUpdateEmployee}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={editEmployee.name}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={editEmployee.gender}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, gender: e.target.value })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={editEmployee.role}
                  onChange={(e) => {
                    setEditEmployee({
                      ...editEmployee,
                      role: e.target.value,
                      jobTitle:
                        e.target.value === "manager"
                          ? ""
                          : editEmployee.jobTitle,
                    })
                  }}
                >
                  <option value="">Select Role</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <select
                  required={editEmployee.role !== "manager"}
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={editEmployee.jobTitle}
                  onChange={(e) =>
                    setEditEmployee({
                      ...editEmployee,
                      jobTitle: e.target.value,
                    })
                  }
                  disabled={editEmployee.role === "manager"}
                >
                  <option value="">Select Job Title</option>
                  <option value="waiter">Waiter</option>
                  <option value="chef">Chef</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={editEmployee.email}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={editEmployee.phone}
                  onChange={(e) =>
                    setEditEmployee({ ...editEmployee, phone: e.target.value })
                  }
                />
              </div>

              {editFormError && (
                <div className="col-span-2 mb-4">
                  <p className="text-sm text-red-500">{editFormError}</p>
                </div>
              )}

              <div className="col-span-2 mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isEditingEmployee}
                  className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditingEmployee}
                  className="flex min-w-[120px] items-center justify-center rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isEditingEmployee ? (
                    <>
                      <svg
                        className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${
            isDeleteModalClosing ? "animate-fadeOut" : "animate-fadeIn"
          }`}
        >
          <div
            className={`w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 ${
              isDeleteModalClosing ? "animate-slideOut" : "animate-slideIn"
            }`}
          >
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 p-3">
                <svg
                  className="h-full w-full text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Confirm Delete
              </h3>
              <p className="text-gray-500">
                Are you sure you want to delete {userToDelete?.name}? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }

        .animate-slideOut {
          animation: slideOut 0.3s ease-out forwards;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}

export default WorkersManagement
