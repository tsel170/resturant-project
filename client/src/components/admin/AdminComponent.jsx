import React, { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "../general/Navbar"
import Footer from "../general/Footer"
import AddBranchForm from "./AddBranchForm"
import AddEntityForm from "./AddEntityForm"
import BranchList from "./BranchList"
import EntityList from "./EntityList"

const AdminComponent = () => {
  const [admins, setAdmins] = useState([])
  const [managers, setManagers] = useState([])
  const [branches, setBranches] = useState([])
  const [showAddForm, setShowAddForm] = useState({ type: null, visible: false })
  const [branchAssignment, setBranchAssignment] = useState({
    visible: false,
    managerIndex: null,
  })

  const addEntity = (type, entity) => {
    if (type === "admin") setAdmins([...admins, entity])
    if (type === "manager")
      setManagers([...managers, { ...entity, branches: [] }])
    if (type === "branch")
      setBranches([...branches, { ...entity, managers: [] }])
    setShowAddForm({ type: null, visible: false })
  }

  const deleteEntity = (type, index) => {
    if (type === "admin") setAdmins(admins.filter((_, i) => i !== index))
    if (type === "manager") setManagers(managers.filter((_, i) => i !== index))
    if (type === "branch") setBranches(branches.filter((_, i) => i !== index))
  }

  const assignBranch = (managerIndex) => {
    setBranchAssignment({ visible: true, managerIndex })
  }

  const removeBranch = (managerIndex, branchIndex) => {
    const updatedManagers = [...managers]
    const updatedBranches = [...branches]

    const manager = updatedManagers[managerIndex]
    const branch = manager.branches[branchIndex]

    manager.branches.splice(branchIndex, 1)

    const branchToUpdate = updatedBranches.find(
      (b) => b.branchName === branch.branchName
    )
    if (branchToUpdate) {
      branchToUpdate.managers = branchToUpdate.managers.filter(
        (m) => m.name !== manager.name
      )
    }

    setManagers(updatedManagers)
    setBranches(updatedBranches)
  }

  const handleBranchSelection = (branchIndex) => {
    const updatedManagers = [...managers]
    const updatedBranches = [...branches]

    const manager = updatedManagers[branchAssignment.managerIndex]
    const branch = updatedBranches[branchIndex]

    // Avoid duplicate assignments
    if (!manager.branches.some((b) => b.branchName === branch.branchName)) {
      manager.branches.push(branch)
    }
    if (!branch.managers.some((m) => m.name === manager.name)) {
      branch.managers.push(manager)
    }

    setManagers(updatedManagers)
    setBranches(updatedBranches)
    setBranchAssignment({ visible: false, managerIndex: null })
  }

  const handleAddAdmin = (newAdmin) => {
    setAdmins([...admins, newAdmin])
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/users/users"
        )
        setAdmins(response.data.users.filter((user) => user.role === "admin"))
        setManagers(
          response.data.users.filter((user) => user.role === "manager")
        )
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    const fetchBrances = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/branches/allBranches"
        )
        setBranches([...response.data])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchUsers()
    fetchBrances()
  }, [])
  useEffect(() => {
    setAdmins([...admins])
  }, [admins])

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={"admin"} />
      <div className="container mx-auto my-8 flex-grow rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Admins Section */}
          <div className="rounded-lg border bg-gray-50 p-4 shadow-md hover:shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Admins
            </h2>
            <button
              onClick={() => setShowAddForm({ type: "admin", visible: true })}
              className="mb-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
              Add Admin
            </button>
            <EntityList
              entities={admins}
              type="admin"
              deleteEntity={deleteEntity}
            />
          </div>

          {/* Managers Section */}
          <div className="rounded-lg border bg-gray-50 p-4 shadow-md hover:shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Managers
            </h2>
            <button
              onClick={() => setShowAddForm({ type: "manager", visible: true })}
              className="mb-4 w-full rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
            >
              Add Manager
            </button>
            <EntityList
              entities={managers}
              type="manager"
              deleteEntity={deleteEntity}
              assignBranch={assignBranch}
              removeBranch={removeBranch}
            />
          </div>

          {/* Branches Section */}
          <div className="rounded-lg border bg-gray-50 p-4 shadow-md hover:shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              Branches
            </h2>
            <button
              onClick={() => setShowAddForm({ type: "branch", visible: true })}
              className="mb-4 w-full rounded bg-purple-500 px-4 py-2 font-bold text-white hover:bg-purple-600"
            >
              Add Branch
            </button>
            <BranchList branches={branches} deleteBranch={deleteEntity} />
          </div>
        </div>
      </div>

      {showAddForm.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md">
            {showAddForm.type === "branch" ? (
              <AddBranchForm
                addBranch={(branch) => addEntity("branch", branch)}
                cancelForm={() =>
                  setShowAddForm({ type: null, visible: false })
                }
              />
            ) : (
              <AddEntityForm
                type={showAddForm.type}
                onSuccess={handleAddAdmin}
                addEntity={(entity) => addEntity(showAddForm.type, entity)}
                cancelForm={() =>
                  setShowAddForm({ type: null, visible: false })
                }
              />
            )}
          </div>
        </div>
      )}

      {branchAssignment.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Select Branch</h2>
            <ul className="space-y-4">
              {branches.map((branch, index) => (
                <li
                  key={index}
                  className="cursor-pointer rounded bg-gray-100 p-2 shadow hover:bg-gray-200"
                  onClick={() => handleBranchSelection(index)}
                >
                  {branch.branchName}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default AdminComponent
