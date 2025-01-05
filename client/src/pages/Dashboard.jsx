import React, { useContext } from "react"
import Footer from "../components/general/Footer"
import Header from "../components/general/Header"
import DashboardContentEmployee from "../components/employee/DashboardContentEmployee"
import Sidebar from "../components/general/Sidebar"
import DashboardContentManager from "../components/manager/DashboardContentManager"
import { AuthContext } from "../context/AuthContext"
import DefaultPage from "../components/general/DefaultPage"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  return (
    <DefaultPage role={user?.role} title="Dashboard" backButton>
      {user?.role === "manager" ? (
        <DashboardContentManager />
      ) : (
        <DashboardContentEmployee />
      )}
    </DefaultPage>
  )
}

export default Dashboard
