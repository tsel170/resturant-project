import React from "react"
import Navbar from "./Header"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"

const E404 = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar role={""} />
      <div className="flex flex-grow items-center justify-center">
        <main className="container mx-auto my-8 text-center">
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h1 className="mb-4 text-4xl font-bold text-orange-600">
              Oops! This pita is empty
            </h1>
            <p className="mb-6 text-xl text-gray-600">
              Looks like the page you're looking for has gone missing, just like
              our secret spice blend recipe!
            </p>
            <div className="mb-8">
              {/* You can add an illustration or animation here */}
            </div>
            <div className="space-x-4">
              <a
                href="/"
                className="rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Back to Login
              </a>
              <button
                onClick={() => navigate(-1)}
                className="rounded-full bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Back to privies page
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default E404
