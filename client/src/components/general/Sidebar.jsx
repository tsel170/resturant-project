import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Sidebar = () => {
  const { isSidebarVisible } = useContext(AuthContext)

  return (
    <aside
      className={`bottom-[64px] left-0 top-[64px] w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 text-gray-100 shadow-xl transition-all duration-300 ease-in-out ${
        isSidebarVisible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ul className="space-y-4">
        <li>
          <Link
            to="/enter-shift"
            className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
          >
            <span className="mr-3 text-gray-400 group-hover:text-blue-400">
              📝
            </span>
            Enter Shift
          </Link>
        </li>
        <li>
          <Link
            to="/personal-space"
            className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
          >
            <span className="mr-3 text-gray-400 group-hover:text-blue-400">
              👤
            </span>
            Personal Space
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
          >
            <span className="mr-3 text-gray-400 group-hover:text-blue-400">
              📊
            </span>
            Dashboard
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
