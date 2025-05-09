import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext.jsx"
import axios from "axios"
import Navbar from "./Header.jsx"
import Footer from "./Footer.jsx"
import backgroundImage from "../../assets/A_cozy_restaurant_interior_design_with_warm_ambien_converted.png"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, setUser } = useContext(AuthContext)
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
      setUser(response.data.userData)
      console.log("response.data.userData", response.data.userData)
      navigate(
        `/${response.data.userData.role === "manager" ? "management" : "enter-shift"}`
      )
    } catch (error) {
      console.error("Login failed:", error.response.data.message)
    }
  }

  return (
    <>
      <div
        className="relative flex min-h-screen flex-col"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <div className="flex flex-grow items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md px-6">
              <div className="flex flex-col gap-6 rounded-xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Please sign in to continue
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="active:scale-97 mt-2 rounded-lg bg-cyan-500 py-2.5 font-medium text-white transition-all hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Login
