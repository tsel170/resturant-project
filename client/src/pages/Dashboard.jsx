import React, { useContext } from "react"
import Footer from "../components/general/Footer"
import Header from "../components/general/Header"
import DashboardContentEmployee from "../components/employee/DashboardContentEmployee"
import Sidebar from "../components/general/Sidebar"
import DashboardContentManager from "../components/manager/DashboardContentManager"
import { AuthContext } from "../context/AuthContext"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header role={"employee"} />
      <div className="flex flex-1">
        <Sidebar />
        <div className="mx-auto flex-1 content-center bg-slate-50 p-6">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">
            {user?.role === "manager" ? "Manager" : "Employee"} Dashboard
          </h1>
          {user?.role === "manager" ? (
            <DashboardContentManager />
          ) : (
            <DashboardContentEmployee />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
