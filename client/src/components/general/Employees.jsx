import React from "react"

const Employees = () => (
  <section className="mt-8 rounded-lg bg-white p-6 shadow-lg">
    <h2 className="mb-4 text-xl font-bold">Employees</h2>
    <table className="w-full table-auto rounded bg-gray-50 shadow">
      <thead className="bg-green-500 text-white">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Role</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">John Doe</td>
          <td className="border px-4 py-2">Manager</td>
          <td className="border px-4 py-2 text-green-600">Active</td>
          <td className="border px-4 py-2">
            <button className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
              Edit
            </button>
            <button className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">
              Remove
            </button>
          </td>
        </tr>
        <tr>
          <td className="border px-4 py-2">Jane Smith</td>
          <td className="border px-4 py-2">Chef</td>
          <td className="border px-4 py-2 text-green-600">Active</td>
          <td className="border px-4 py-2">
            <button className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
              Edit
            </button>
            <button className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
)

export default Employees
