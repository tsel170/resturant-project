import React from "react"

const MenuList = ({ menuItems, deleteMenuItem }) => {
  return (
    <ul className="space-y-2">
      {menuItems.map((menuItem, index) => (
        <li
          key={index}
          className="flex flex-col gap-2 rounded bg-white p-4 shadow"
        >
          <div className="font-semibold">
            <span className="text-lg">{menuItem.title}</span> -{" "}
            <span className="text-green-600">${menuItem.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600">{menuItem.description}</p>
          <p className="text-sm text-gray-600">
            Category: <span className="font-bold">{menuItem.category}</span>
          </p>
          <p className="text-sm text-gray-600">
            Prepared by:{" "}
            <span className="font-bold">{menuItem.theDishPreparer}</span>
          </p>
          <ul className="mt-2 space-y-1">
            {menuItem.ingredients.map((ingredient, i) => (
              <li key={i} className="text-sm text-gray-500">
                {ingredient.ingredient} - {ingredient.quantity}
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <button
              onClick={() => deleteMenuItem(index)}
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default MenuList
