import React, { useContext } from "react"
import { Route, Navigate } from "react-router-dom"
import Dashboard from "../../pages/Dashboard"
import DashboardContentChef from "../employee/DashboardContentChef"
import EnterShift from "../../pages/EnterShift"
import PersonalSpace from "../../pages/PersonalSpace"
import OrdersManagement from "../../pages/OrdersManagement"
import TablesManagement from "../../pages/TablesManagement"
import ManagementTables from "../../pages/manage/ManagementTables"
import MenuManagement from "../manager/MenuManagement"
import WorkersManagement from "../../pages/manage/WorkersManagement"
import ShiftsManagement from "../../pages/manage/ShiftsManagement"
import Management from "../../pages/Management"
import Statistics from "../../pages/Statistics"
import { AuthContext } from "../../context/AuthContext"

export const ProtectedRoute = ({ element: Component, allowedRoles = [] }) => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return Component
}
