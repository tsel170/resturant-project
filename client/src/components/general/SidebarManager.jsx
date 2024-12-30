import React from "react"
import { Link } from "react-router-dom"

const SidebarManager = () => {
  return (
    <ul className="space-y-4">
      <li>
        <Link
          to="/manage-shifts"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            📅
          </span>
          Manage Shifts
        </Link>
      </li>
      <li>
        <Link
          to="/manage-employees"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            👥
          </span>
          Manage Employees
        </Link>
      </li>
      <li>
        <Link
          to="/reports"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            📊
          </span>
          Reports
        </Link>
      </li>
      <li>
        <Link
          to="/settings"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            ⚙️
          </span>
          Settings
        </Link>
      </li>
    </ul>
  )
}

export default SidebarManager
