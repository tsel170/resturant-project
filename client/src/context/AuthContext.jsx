import axios from "axios"
import React, { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("token", userData.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const [orders, setOrders] = useState([])
  const [tables, setTables] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/bons/bons"
        )
        // Handle the response data here
        orders.push(...response.data.Bons)
        setOrders((prev) => [...prev])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_SERVER + "/api/bons/bons"
        )
        // Handle the response data here
        tables.push(...response.data.Bons)
        setTables((prev) => [...prev])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isSidebarVisible,
        toggleSidebar,
        orders,
        setOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
