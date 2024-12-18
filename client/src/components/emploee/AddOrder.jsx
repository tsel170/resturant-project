import React, { useState } from "react"

const AddOrder = ({ params }) => {
  const { AddOrderObject, setAddOrderObject, tables, setTables, setOrders } =
    params
  // console.log(params)

  const [orderNumber, setOrderNumber] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [dishes, setDishes] = useState([""])

  const handleDishChange = (index, value) => {
    const updatedDishes = [...dishes]
    updatedDishes[index] = value
    setDishes(updatedDishes)
  }

  const addDishField = () => {
    setDishes([...dishes, ""])
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const order = {
      table: AddOrderObject,
      number: orderNumber,
      items: dishes.filter((dish) => dish.trim() !== ""), // Filter out empty dishes
      ready: false, // Default to false
    }
    // console.log(order)

    // Update orders state with the new order
    setOrders((prevOrders) => [order, ...prevOrders])

    tables.forEach((table) => {
      if (table.number == order.table) table.order.push(order.number)
    })
    console.log(tables)

    setTables((prev) => [...prev])
    // Reset form and close the AddOrder dialog
    setOrderNumber("")
    setTableNumber("")
    setDishes([""])
    setAddOrderObject(null)

    console.log("Order submitted:", order)
  }

  return (
    <div
      className={`${
        AddOrderObject != null ? "" : "hidden"
      } rounded-md bg-slate-200 p-4 shadow-md`}
    >
      <form onSubmit={handleSubmit}>
        {/* Table Number Input */}
        <div className="mb-4">
          <label htmlFor="tableNumber" className="mb-2 block font-semibold">
            Table Number: {AddOrderObject}
          </label>
        </div>

        {/* Order Number Input */}
        <div className="mb-4">
          <label htmlFor="orderNumber" className="mb-2 block font-semibold">
            Order Number:x
          </label>
        </div>

        {/* Dish Inputs */}
        <div className="mb-4">
          <label className="mb-2 block font-semibold">Dishes:</label>
          {dishes.map((dish, index) => (
            <div key={index} className="mb-2 flex items-center gap-2">
              <input
                type="text"
                value={dish}
                onChange={(e) => handleDishChange(index, e.target.value)}
                className="flex-1 rounded-md border px-3 py-2"
                placeholder={`Dish ${index + 1}`}
                required
              />
            </div>
          ))}
        </div>

        {/* Add Dish Button */}
        <button
          type="button"
          onClick={addDishField}
          className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
        >
          Add Another Dish
        </button>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full rounded-md bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddOrder
