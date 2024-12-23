import React, { useState } from "react"
import axios from "axios"

const AddEntityForm = ({ type, cancelForm, onSuccess }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newEntity = { name, email, password, phone, gender, role: type }

    try {
      // Make POST request to server
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/users/register`,
        newEntity
      )
      console.log("Admin added:", response.data)

      // Call onSuccess callback to refresh the list or handle UI updates
      onSuccess(response.data)

      // Clear the form and error state
      setName("")
      setEmail("")
      setPassword("")
      setPhone("")
      setGender("")
      setError("")
      cancelForm()
    } catch (err) {
      console.error("Error adding admin:", err)
      setError("Failed to add admin. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        Add {type.charAt(0).toUpperCase() + type.slice(1)}
      </h2>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="mb-4">
        <label htmlFor="name" className="block font-bold text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block font-bold text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block font-bold text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="phone" className="block font-bold text-gray-700">
          Phone
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gender" className="block font-bold text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
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

export default AddEntityForm
