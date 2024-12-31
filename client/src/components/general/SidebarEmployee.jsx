import React from "react"
import { Link } from "react-router-dom"

const SidebarEmployee = () => {
  return (
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
  )
}

export default SidebarEmployee
