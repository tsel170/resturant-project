import React from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import { FaCalendarAlt, FaMoneyBillWave, FaHistory } from "react-icons/fa"

const PersonalSpace = () => {
  const navigate = useNavigate() // Hook for navigation

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex flex-1 flex-col justify-center p-6">
          <h1 className="mb-8 text-center text-4xl font-bold">
            Welcome to the personal space!
          </h1>
          {/* Grid Layout for Personal Space */}
          <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8">
            {/* Shifts Section */}
            <div
              onClick={() => navigate("/shifts")}
              className="group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-6 text-blue-500 transition-transform group-hover:scale-110">
                <FaCalendarAlt size={48} />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-blue-600">Shifts</h2>
              <p className="mb-4 text-center text-gray-600">
                View shift details
              </p>
              <span className="text-sm font-semibold text-blue-500 group-hover:underline">
                View Shifts →
              </span>
            </div>

            {/* Tips Section */}
            <div
              onClick={() => navigate("/tips")}
              className="group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-6 text-green-500 transition-transform group-hover:scale-110">
                <FaMoneyBillWave size={48} />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-green-600">Tips</h2>
              <p className="mb-4 text-center text-gray-600">
                Check your tips summary
              </p>
              <span className="text-sm font-semibold text-green-500 group-hover:underline">
                View Tips →
              </span>
            </div>

            {/* History Section */}
            <div
              onClick={() => navigate("/history")}
              className="flex transform cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <div className="mb-6 text-blue-800 transition-transform group-hover:scale-110">
                <FaHistory size={48} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-blue-800">History</h2>
              <p className="text-center text-gray-600">
                Review your complete work history
              </p>
              <span className="text-sm font-semibold text-blue-800 group-hover:underline">
                View History →
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PersonalSpace
