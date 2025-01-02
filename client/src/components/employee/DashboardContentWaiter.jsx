import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Orders from "./Orders"
import Tables from "./Tables"
import { AuthContext } from "../../context/AuthContext"

const DashboardContentWaiter = () => {
  const navigate = useNavigate()
  const { orders } = useContext(AuthContext)
  return (
    <div className="space-y-6">
      <div
        className="cursor-pointer rounded-lg bg-white shadow"
        onClick={() => navigate("/orders")}
      >
        {orders.length > 0 && <Orders params={{ orders }} />}
      </div>

      <div className="rounded-lg bg-white shadow">
        <Tables />
      </div>
    </div>
  )
}

export default DashboardContentWaiter
