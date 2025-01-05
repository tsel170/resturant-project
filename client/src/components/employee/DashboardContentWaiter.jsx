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
      <div className="rounded-lg bg-white shadow">
        {orders.length > 0 && <Orders params={{ orders }} />}
        <div className="flex justify-center p-4">
          <button
            className="cursor-pointer rounded-md bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700 hover:shadow-lg"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow">
        <Tables />
      </div>
    </div>
  )
}

export default DashboardContentWaiter
