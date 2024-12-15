import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const Navbar2 = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/products">Products</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar2
