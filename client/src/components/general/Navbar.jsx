import React from "react"
import { Link } from "react-router-dom"

const Navbar = ({ role }) => (
  <nav className="bg-green-600 py-4 text-white">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-2xl font-bold">Restaurant {role}</h1>
      <ul className="flex space-x-6">
        <li>
          <Link to="/">Login</Link>
        </li>
      </ul>
    </div>
  </nav>
)

export default Navbar
