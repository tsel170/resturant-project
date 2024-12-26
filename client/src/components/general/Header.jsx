import React, { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const Header = ({ role }) => {
  const { toggleSidebar } = useContext(AuthContext)

  return (
    <header className="flex items-center bg-green-600 py-2 text-white shadow-md">
      <button
        onClick={() => toggleSidebar()}
        className="mr-4 text-white hover:text-gray-200 focus:outline-none active:text-gray-300"
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
      <div className="container mx-auto flex items-center">
        {/* Hamburger Icon */}

        {/* Title */}
        <h1 className="text-xl font-bold">
          Great Pita && Tavlinim{role ? `: ${role}` : "."}
        </h1>
      </div>
    </header>
  )
}

export default Header
