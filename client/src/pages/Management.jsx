import React from "react"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"
import { FaUsers, FaUtensils, FaCalendarAlt, FaTable } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import DefaultPage from "../components/general/DefaultPage"

const Management = () => {
  const navigate = useNavigate()

  return (
    <DefaultPage role={"manager"} title={"Management Dashboard"} backButton>
      {/* Grid Layout for Management */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8">
        {/* Shifts Management Section */}
        <div
          onClick={() => navigate("/coming-soon")}
          className="group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="mb-6 text-purple-500 transition-transform group-hover:scale-110">
            <FaCalendarAlt size={48} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-purple-600">Shifts</h2>
          <p className="mb-4 text-center text-gray-600">
            Schedule and manage shifts
          </p>
          <span className="text-sm font-semibold text-purple-500 group-hover:underline">
            Manage Shifts →
          </span>
        </div>

        {/* Workers Management Section */}
        <div
          onClick={() => navigate("/manageworkers")}
          className="group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="mb-6 text-blue-500 transition-transform group-hover:scale-110">
            <FaUsers size={48} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-blue-600">Workers</h2>
          <p className="mb-4 text-center text-gray-600">
            Manage employee information
          </p>
          <span className="text-sm font-semibold text-blue-500 group-hover:underline">
            Manage Workers →
          </span>
        </div>

        {/* Menu Management Section */}
        <div
          onClick={() => navigate("/managemenu")}
          className="group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="mb-6 text-green-500 transition-transform group-hover:scale-110">
            <FaUtensils size={48} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-green-600">Menu</h2>
          <p className="mb-4 text-center text-gray-600">
            Update menu items and prices
          </p>
          <span className="text-sm font-semibold text-green-500 group-hover:underline">
            Manage Menu →
          </span>
        </div>

        {/* Tables Management Section */}
        <div
          onClick={() => navigate("/managetables")}
          className="group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
        >
          <div className="mb-6 text-orange-500 transition-transform group-hover:scale-110">
            <FaTable size={48} />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-orange-600">Tables</h2>
          <p className="mb-4 text-center text-gray-600">
            Manage table layout and settings
          </p>
          <span className="text-sm font-semibold text-orange-500 group-hover:underline">
            Manage Tables →
          </span>
        </div>
      </div>
    </DefaultPage>
  )
}

export default Management
