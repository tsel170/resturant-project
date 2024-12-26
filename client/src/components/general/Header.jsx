import React from "react"
import { Link } from "react-router-dom"

const Header = ({ role }) => (
  <nav className="bg-green-600 py-4 text-white">
    <div className="container mx-auto flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        Great Pita && Tavlinim{role ? `: ${role}` : "."}
      </h1>
    </div>
  </nav>
)

export default Header
