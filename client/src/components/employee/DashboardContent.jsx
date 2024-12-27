import React from "react"
import { useNavigate } from "react-router-dom"
import Tables from "./Tables"
import Orders from "./Orders"

const DashboardContent = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div
        className="cursor-pointer rounded-lg bg-white shadow"
        onClick={() => navigate("/orders")}
      >
        <Orders />
      </div>

      <div
        className="cursor-pointer rounded-lg bg-white shadow"
        onClick={() => navigate("/tables")}
      >
        <Tables />
      </div>
    </div>
  )
}

export default DashboardContent
