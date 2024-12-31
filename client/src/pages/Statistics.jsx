import React from "react"
import Header from "../components/general/Header"
import Sidebar from "../components/general/Sidebar"
import Footer from "../components/general/Footer"

const Statistics = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="mb-2 text-4xl font-bold text-gray-800">
                Coming Soon
              </h2>
              <p className="text-gray-600">
                Statistics and analytics features are under development
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Statistics
