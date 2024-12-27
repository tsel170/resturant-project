import React, { useState, useEffect } from "react"
import Sidebar from "../components/general/Sidebar"
import Header from "../components/general/Header"
import Footer from "../components/general/Footer"

const EnterShift = () => {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      )
    }, 1000)

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          {/* Header Section */}
          <div className="mb-10 flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">John Doe</h1>
              <p className="text-lg text-gray-600">Employee</p>
            </div>
            <div className="text-2xl font-medium text-blue-600">
              {currentTime}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-gray-800">
                Welcome Back!
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Ready to start your shift? Click the button below.
              </p>
            </div>
            <button className="transform rounded-lg bg-blue-500 px-8 py-4 text-2xl font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700">
              Start Shift
            </button>
          </div>

          {/* Decorative Section */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Shift Duration</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">8 hours</p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Tips Earned (Last Shift)</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">$125</p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
              <p className="text-lg text-gray-600">Tips Earned (This Month)</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">$850</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default EnterShift
