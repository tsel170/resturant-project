import React, { useState } from "react"

const AddTableForm = ({ params }) => {
  const { addTable, setShowAddForm } = params
  const [tableNumber, setTableNumber] = useState("")
  const [seats, setSeats] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (tableNumber && seats) {
      addTable(Number(tableNumber), Number(seats))
      setTableNumber("")
      setSeats("")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-lg border border-yellow-400 bg-yellow-100 p-4 shadow"
    >
      <div className="mb-4">
        <label
          htmlFor="tableNumber"
          className="block font-bold text-yellow-600"
        >
          Table Number
        </label>
        <input
          type="number"
          id="tableNumber"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Enter table number"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="seats" className="block font-bold text-yellow-600">
          Number of Seats
        </label>
        <input
          type="number"
          id="seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          placeholder="Enter number of seats"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
          onClick={() => setShowAddForm(false)}
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddTableForm
