import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"

import { AuthContext } from "../../context/AuthContext"
import DashboardContentWaiter from "./DashboardContentWaiter"
import DashboardContentChef from "./DashboardContentChef"

const DashboardContentEmployee = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  return (
    <>
      {user?.jobTitle === "waiter" && <DashboardContentWaiter />}
      {user?.jobTitle === "chef" && <DashboardContentChef />}
    </>
  )
}

export default DashboardContentEmployee
