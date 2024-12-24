import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext.jsx"
import axios from "axios"
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/users/login`,
        {
          email,
          password,
        }
      )
      login(response.data)
      console.log(response)

      navigate(`/${response.data.user.role || "employee"}`)
    } catch (error) {
      console.error("Login failed:", error.response.data.message)
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col bg-gray-100">
        <Navbar />
        <form
          onSubmit={handleSubmit}
          className="mx-auto my-8 flex flex-grow content-center items-center"
        >
          <div className="flex flex-col gap-3 rounded-lg p-6 text-center duration-200 focus-within:bg-gray-200 focus-within:shadow hover:bg-gray-200 hover:shadow">
            <h2>Enter your email and password</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="peer"
            />
            <button
              type="submit"
              className="rounded-md p-1 px-2 duration-200 peer-valid:bg-cyan-400 peer-valid:hover:scale-105 peer-valid:hover:bg-cyan-500 peer-valid:active:scale-95 peer-invalid:cursor-default peer-invalid:bg-red-300 peer-invalid:hover:scale-100 peer-invalid:hover:bg-red-300 peer-invalid:disabled:bg-red-300"
            >
              Login
            </button>
          </div>
        </form>
        <Footer />
      </div>
    </>
  )
}

export default Login
