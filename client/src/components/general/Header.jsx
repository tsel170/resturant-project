import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const Header = ({ role }) => {
  const { toggleSidebar, isSidebarVisible, logout, user } =
    useContext(AuthContext)

  return (
    <header className="flex items-center bg-green-600 py-2 text-white shadow-md">
      <button
        onClick={() => toggleSidebar()}
        className={`${isSidebarVisible ? "" : "rotate-90"} mr-4 duration-200 hover:text-gray-200 focus:outline-none active:text-gray-300`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="container mx-auto flex items-center justify-between">
        {/* Title */}
        <h1 className="text-xl font-bold">
          Great Pita && Tavlinim{role ? `: ${role}` : "."}
        </h1>

        {/* Logout Button */}
        {user && (
          <button
            onClick={logout}
            className="rounded px-4 py-2 hover:bg-green-700 focus:outline-none active:bg-green-800"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
