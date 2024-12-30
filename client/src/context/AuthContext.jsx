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
  const [tables, setTables] = useState([
    { number: 1, seats: 4, orders: [], isOccupied: false },
    { number: 2, seats: 2, orders: [], isOccupied: false },
    { number: 3, seats: 6, orders: [], isOccupied: false },
    { number: 4, seats: 4, orders: [], isOccupied: false },
    // Add more tables as needed
  ])

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
    //add axios here
  }, [])

  const updateTable = (tableId, updates) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.number === tableId ? { ...table, ...updates } : table
      )
    )

    // If you're connecting to a backend, add API call here
    // await axios.patch(`/api/tables/${tableId}`, updates);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isSidebarVisible,
        toggleSidebar,
        orders,
        setOrders,
        tables,
        setTables,
        updateTable,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
