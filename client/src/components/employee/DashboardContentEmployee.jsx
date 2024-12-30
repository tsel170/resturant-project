import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Tables from "./Tables"
import Orders from "./Orders"
import { AuthContext } from "../../context/AuthContext"

const DashboardContentEmployee = () => {
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

export default DashboardContentEmployee
