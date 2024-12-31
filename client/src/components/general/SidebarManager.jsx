import React from "react"
import { Link } from "react-router-dom"

const SidebarManager = () => {
  return (
    <ul className="space-y-4">
      <li>
        <Link
          to="/dashboard"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            ⏱️
          </span>
          Current Shift
        </Link>
      </li>
      <li>
        <Link
          to="/management"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            ⚙️
          </span>
          Management
        </Link>
      </li>
      <li>
        <Link
          to="/statistics"
          className="group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-gray-700"
        >
          <span className="mr-3 text-gray-400 group-hover:text-blue-400">
            📊
          </span>
          Statistics
        </Link>
      </li>
    </ul>
  )
}

export default SidebarManager
