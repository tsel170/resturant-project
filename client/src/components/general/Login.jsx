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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

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
      navigate(
        `/${response.data.userData.role === "manager" ? "management" : "enter-shift"}`
      )
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      )
    } finally {
      setIsLoading(false)
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

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

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
                      disabled={isLoading}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                      disabled={isLoading}
                      className="rounded-lg border border-gray-300 px-4 py-2 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="active:scale-97 mt-2 flex items-center justify-center rounded-lg bg-cyan-500 py-2.5 font-medium text-white transition-all hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-cyan-400"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
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
