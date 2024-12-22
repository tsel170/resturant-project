import React, { useState } from "react"

const AddEmployeeForm = ({ addEmployee, cancelForm, existingEmails }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")
  const [branch, setBranch] = useState([])
  const [jobTitle, setJobTitle] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check for duplicate email
    if (existingEmails.includes(email)) {
      setError("An employee with this email already exists.")
      return
    }

    // Reset error and proceed with submission
    setError("")
    addEmployee({
      name,
      email,
      phone,
      gender,
      branch,
      jobTitle,
      role: "employee",
    })
    setName("")
    setEmail("")
    setPhone("")
    setGender("")
    setBranch([])
    setJobTitle("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-lg border bg-blue-100 p-4 shadow"
    >
      <div className="mb-4">
        <label htmlFor="name" className="block font-bold text-blue-600">
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
        <label htmlFor="email" className="block font-bold text-blue-600">
          Email
        </label>
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
          className={`w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
          }`}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block font-bold text-blue-600">
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
        <label htmlFor="gender" className="block font-bold text-blue-600">
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
      <div className="mb-4">
        <label htmlFor="branch" className="block font-bold text-blue-600">
          Branch
        </label>
        <input
          type="text"
          id="branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value.split(","))}
          placeholder="Enter branch IDs (comma-separated)"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="jobTitle" className="block font-bold text-blue-600">
          Job Title
        </label>
        <select
          id="jobTitle"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Select Job Title</option>
          <option value="waiter">Waiter</option>
          <option value="barista">Barista</option>
          <option value="chef">Chef</option>
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

export default AddEmployeeForm
