import React, { useState } from "react"

const AddMenuItemForm = ({ params }) => {
  const { addMenuItem, setShowAddForm } = params
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [ingredient, setIngredient] = useState("")
  const [quantity, setQuantity] = useState("")
  const [theDishPreparer, setTheDishPreparer] = useState("")

  const handleAddIngredient = () => {
    if (ingredient && quantity) {
      setIngredients([...ingredients, { ingredient, quantity }])
      setIngredient("")
      setQuantity("")
    }
  }

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index)
    setIngredients(updatedIngredients)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title && description && price && category && theDishPreparer) {
      addMenuItem({
        title,
        description,
        price: parseFloat(price),
        image,
        category,
        ingredients,
        theDishPreparer,
      })
      setTitle("")
      setDescription("")
      setPrice("")
      setImage("")
      setCategory("")
      setIngredients([])
      setTheDishPreparer("")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded-lg border bg-green-100 p-4 shadow"
    >
      <div className="mb-4">
        <label htmlFor="title" className="block font-bold text-green-600">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter dish title"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-bold text-green-600">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block font-bold text-green-600">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block font-bold text-green-600">
          Image URL
        </label>
        <input
          type="file"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter image URL"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block font-bold text-green-600">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold text-green-600">Ingredients</label>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Ingredient"
            className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            Add Ingredient
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {ingredients.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded bg-white p-2 shadow"
            >
              <span>
                {item.ingredient} - {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="font-bold text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <label
          htmlFor="theDishPreparer"
          className="block font-bold text-green-600"
        >
          Dish Preparer
        </label>
        <select
          id="theDishPreparer"
          value={theDishPreparer}
          onChange={(e) => setTheDishPreparer(e.target.value)}
          className="w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <option value="">Select Dish Preparer</option>
          <option value="chef">Chef</option>
          <option value="waiter">Waiter</option>
          <option value="barista">Barista</option>
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
          onClick={() => setShowAddForm(false)}
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddMenuItemForm
