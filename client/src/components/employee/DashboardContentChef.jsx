import React, { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Orders from "./Orders"
import { AuthContext } from "../../context/AuthContext"

const DashboardContentChef = () => {
  const navigate = useNavigate()
  const { orders } = useContext(AuthContext)

  return (
    <div className="space-y-6">
      <div
        className="cursor-pointer rounded-lg bg-white shadow"
        onClick={() => navigate("/orders")}
      >
        {orders.length > 0 && (
          <Orders params={{ orders, viewType: "kitchen" }} />
        )}
      </div>

      {/* Kitchen-specific stats or metrics could go here */}
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-4 text-xl font-semibold">Kitchen Overview</h2>
        {/* Add kitchen-specific components here */}
      </div>
    </div>
  )
}

export default DashboardContentChef
