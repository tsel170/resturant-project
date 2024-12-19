import React, { useState } from "react"
import MenuList from "./MenuList"
import AddMenuItemForm from "./AddMenuItemForm"

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  const addMenuItem = ({
    title,
    description,
    price,
    image,
    category,
    ingredients,
    theDishPreparer,
  }) => {
    if (title && description && price && category && theDishPreparer) {
      setMenuItems([
        ...menuItems,
        {
          title,
          description,
          price,
          image,
          category,
          ingredients,
          theDishPreparer,
        },
      ])
      setShowAddForm(false)
    }
  }

  const deleteMenuItem = (index) => {
    const updatedMenuItems = menuItems.filter((_, i) => i !== index)
    setMenuItems(updatedMenuItems)
  }

  return (
    <div className="rounded-lg bg-green-50 p-6 shadow duration-200 focus-within:bg-green-100 focus-within:shadow-md hover:bg-green-100 hover:shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-green-600">
        Menu Management
      </h2>

      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
        >
          Add Menu Item
        </button>
      )}

      {showAddForm && (
        <AddMenuItemForm params={{ addMenuItem, setShowAddForm }} />
      )}

      <MenuList menuItems={menuItems} deleteMenuItem={deleteMenuItem} />
    </div>
  )
}

export default MenuManagement
