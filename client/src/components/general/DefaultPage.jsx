import React from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import { useNavigate } from "react-router-dom"

const DefaultPage = ({ role, title, children }) => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={role} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <button
            onClick={() => navigate(-1)}
            className="group relative mr-6 flex items-center rounded-lg bg-white px-6 py-3 font-medium text-gray-700 shadow-md transition-all duration-200 hover:bg-gray-50 hover:shadow-lg active:scale-95"
          >
            <span className="absolute inset-0 flex h-full w-1 items-center">
              <span className="h-8 w-1 rounded-r bg-green-500 transition-all duration-200 group-hover:h-full"></span>
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
          <h2 className="mb-6 text-2xl font-bold text-gray-800">{title}</h2>
          <div className="flex min-h-screen flex-col bg-slate-50">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DefaultPage
