import React, { useState } from "react"

const AddEntityForm = ({ addEntity, cancelForm, type }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [role, setRole] = useState("")
  const [branch, setBranch] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const newEntity = {
      name,
      email,
      password,
      phone,
      gender,
      role: type,
      branch: role === "manager" ? branch : null,
    }

    console.log(newEntity)

    addEntity(newEntity)
    setName("")
    setEmail("")
    setPassword("")
    setPhone("")
    setGender("")
    setRole("")
    setBranch("")
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Add Entity</h2>
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

      {role === "manager" && (
        <div className="mb-4">
          <label htmlFor="branch" className="block font-bold text-gray-700">
            Branch
          </label>
          <input
            type="text"
            id="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Enter branch ID"
            required
            className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      )}
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
