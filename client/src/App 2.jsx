import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar.jsx"
import Login from "./components/Login"
import Products from "./components/Products.jsx"
import Register from "./components/Register.jsx"
import Navbar2 from "./components/Navbar2.jsx"

const App2 = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar2 />
        <Routes>
          <Route path="/" element={<h1>Welcome to Home</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App2
