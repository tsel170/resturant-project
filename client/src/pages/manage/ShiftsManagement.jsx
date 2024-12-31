import React from "react"
import Header from "../../components/general/Header"
import Sidebar from "../../components/general/Sidebar"
import Footer from "../../components/general/Footer"

const ShiftsManagement = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-gray-100">
      <Header role={"manager"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center p-6">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Shifts Management
          </h2>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ShiftsManagement
