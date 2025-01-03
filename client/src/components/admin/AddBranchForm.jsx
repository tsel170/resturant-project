import axios from "axios"
import React, { useState } from "react"

const AddBranchForm = ({ fetchBrances, cancelForm }) => {
  const [branchName, setBranchName] = useState("")
  const [address, setAddress] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newBranch = { branchName, address }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/branches/addBranch`,
        newBranch
      )
      fetchBrances()
      setBranchName("")
      setAddress("")
      cancelForm()
    } catch (error) {
      alert("somthing went wrong")
      console.error(error)
      setError("Failed to add Branche. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Add Branch</h2>
      <div className="mb-4">
        <label htmlFor="branchName" className="block font-bold text-gray-700">
          Branch Name
        </label>
        <input
          type="text"
          id="branchName"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Enter branch name"
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="address" className="block font-bold text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter branch address"
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="mr-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
        >
          Save
        </button>
        <button
          type="button"
          onClick={cancelForm}
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddBranchForm
