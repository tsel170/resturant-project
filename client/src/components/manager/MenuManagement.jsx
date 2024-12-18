import React, { useState } from "react"

const MenuManagement = () => {
  const [dishes, setDishes] = useState([])
  const [newDish, setNewDish] = useState("")

  const addDish = () => {
    if (newDish) {
      setDishes([...dishes, newDish])
      setNewDish("")
    }
  }

  const deleteDish = (index) => {
    const updatedDishes = dishes.filter((_, i) => i !== index)
    setDishes(updatedDishes)
  }

  return (
    <div className="rounded-lg bg-green-50 p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold text-green-600">
        Menu Management
      </h2>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newDish}
          onChange={(e) => setNewDish(e.target.value)}
          placeholder="Enter dish name"
          className="flex-grow rounded-l-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={addDish}
          className="rounded-r-md bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {dishes.map((dish, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded bg-white p-2 shadow"
          >
            <span>{dish}</span>
            <button
              onClick={() => deleteDish(index)}
              className="font-bold text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MenuManagement
