import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Sidebar = () => {
  const { isSidebarVisible } = useContext(AuthContext)

  return (
    <aside
      className={`h-auto w-48 bg-gray-300 p-4 ${isSidebarVisible ? "" : "hidden"}`}
    >
      <ul className="space-y-2">
        <li className="font-medium">
          <Link
            to="/enter-shift"
            className="block cursor-pointer hover:text-blue-500"
          >
            Enter Shift
          </Link>
        </li>
        <li className="font-medium">
          <Link
            to="/personal-space"
            className="block cursor-pointer hover:text-blue-500"
          >
            Personal Space
          </Link>
        </li>
        <li className="font-medium">
          <Link
            to="/dashboard"
            className="block cursor-pointer hover:text-blue-500"
          >
            Dashboard
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
