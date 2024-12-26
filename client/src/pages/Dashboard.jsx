import React from "react"
import Footer from "../components/general/Footer"
import Header from "../components/general/Header"
import DashboardContent from "../components/employee/DashboardContent"
import Sidebar from "../components/general/Sidebar"

const Dashboard = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center bg-slate-50 p-6">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            Employee Dashboard
          </h1>
          <DashboardContent />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
