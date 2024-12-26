import React from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"

const PersonalSpace = () => {
  const navigate = useNavigate() // Hook for navigation

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 p-6">
          {/* Grid Layout for Personal Space */}
          <div className="grid grid-cols-3 gap-8">
            {/* Shifts Section */}
            <div
              onClick={() => navigate("/shifts")}
              className="flex transform cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <h2 className="mb-2 text-2xl font-bold text-blue-600">Shifts</h2>
              <p className="text-sm text-gray-600">View shift details.</p>
            </div>

            {/* Tips Section */}
            <div
              onClick={() => navigate("/tips")}
              className="flex transform cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <h2 className="mb-2 text-2xl font-bold text-green-600">Tips</h2>
              <p className="text-sm text-gray-600">Check your tips summary.</p>
            </div>

            {/* History Section */}
            <div
              onClick={() => navigate("/history")}
              className="flex transform cursor-pointer flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <h2 className="mb-2 text-2xl font-bold text-purple-600">
                History
              </h2>
              <p className="text-sm text-gray-600">Review your work history.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PersonalSpace
